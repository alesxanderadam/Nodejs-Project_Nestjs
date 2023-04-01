import { CinemaDto, Cineplex } from './../../models/cinema/dto/cinema.dto';
import { plainToClass } from 'class-transformer';
import { CumRap, PrismaClient } from '@prisma/client';
import { ResponseService } from './../../common/response-status';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CinemaService {
    constructor(
        private readonly responseStatus: ResponseService,
    ) { }
    private prisma = new PrismaClient()

    public addBidanh(cinema: CinemaDto): CinemaDto {
        return {
            ...cinema,
            biDanh: cinema.tenHeThong.toLocaleLowerCase().replace(/ /g, "-")
        }
    }


    async getAllCinema(res: Response, keyword: string) {
        try {
            const listCinema = await this.prisma.heThongRap.findMany({
                where: keyword ? { ten_he_thong: { contains: keyword } } : undefined
            });
            if (listCinema) {
                const plainCinema = plainToClass(CinemaDto, listCinema)
                const result = plainCinema.map(this.addBidanh)
                this.responseStatus.successCode(res, result, "Xử lý thành công")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getDetailCenema(res: Response, id: string) {
        try {
            const findCinema = await this.prisma.heThongRap.findUnique({
                where: { ma_he_thong_rap: id },
                select: {
                    CumRap: {
                        select: {
                            ma_cum_rap: true,
                            ten_cum_rap: true,
                            dia_chi: true,
                            RapPhim: {
                                select: {
                                    ma_rap: true,
                                    ten_rap: true
                                }
                            }
                        }
                    },
                }
            })
            if (findCinema) {
                //Refactor code 
                const { CumRap } = findCinema;
                console.log(findCinema)
                const plainCinema = {
                    maCumRap: CumRap[0].ma_cum_rap,
                    tenCumRap: CumRap[0].ten_cum_rap,
                    diaChi: CumRap[0].dia_chi,
                    danhSachRap: CumRap[0].RapPhim.map(x => {
                        return {
                            maRap: x.ma_rap,
                            tenRap: x.ten_rap
                        }
                    })
                };
                this.responseStatus.successCode(res, plainCinema, "Xử lý thành công")
            } else {
                this.responseStatus.sendBadRequestResponse(res, findCinema, "Không tìm  thấy dữ liêụ")
                return;
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMovieScheduleSystemInfo(res: Response, id: string) {
        try {
            const findCinema = await this.prisma.heThongRap.findMany({
                where: { ma_he_thong_rap: id },
                select: {
                    CumRap: {
                        select: {
                            RapPhim: {
                                select: {
                                    LichChieu: {
                                        select: {
                                            Phim: {
                                                select: {
                                                    LichChieu: true,
                                                    ma_phim: true,
                                                    ten_phim: true,
                                                    hinh_anh: true,
                                                    hot: true,
                                                    dang_chieu: true,
                                                    sap_chieu: true,
                                                    danh_gia: true
                                                }
                                            }
                                        }
                                    }
                                },
                            },
                        }
                    }
                }
            })
            const transformedData = findCinema.map(cinema => ({
                lstCumRap: cinema.CumRap.map(cumRap => ({
                    //flatMap sẽ áp dụng một hàm cho mỗi phần tử trong mảng ban đầu, và trả về một mảng con. Sau đó, nó sẽ nối các mảng con này thành một mảng đơn và trả về kết quả.
                    danhSachPhim: cumRap.RapPhim.flatMap(rapPhim => {
                        const uniqueMovies = new Map();
                        return rapPhim.LichChieu.reduce((result, lichChieu) => {
                            if (!uniqueMovies.has(lichChieu.Phim.ma_phim)) {
                                uniqueMovies.set(lichChieu.Phim.ma_phim, true);
                                result.push({
                                    maPhim: lichChieu.Phim.ma_phim,
                                    tenPhim: lichChieu.Phim.ten_phim,
                                    hinhAnh: lichChieu.Phim.hinh_anh,
                                    hot: lichChieu.Phim.hot,
                                    dangChieu: lichChieu.Phim.dang_chieu,
                                    sapChieu: lichChieu.Phim.sap_chieu,
                                    lstLichChieuTheoPhim: []
                                });
                            }
                            const movie = result.find(m => m.maPhim === lichChieu.Phim.ma_phim);
                            movie.lstLichChieuTheoPhim.push(
                                lichChieu.Phim.LichChieu.map(x => {
                                    return {
                                        maLichChieu: x.ma_lich_chieu,
                                        maRap: x.ma_rap,
                                        // tenRap: this.prisma.rapPhim.findUnique
                                        ngayChieuGioChieu: x.ngay_gio_chieu,
                                        giaVe: x.gia_ve
                                    }
                                })
                            );
                            return result;
                        }, []);
                    })
                }))
            }));

            if (transformedData) {
                this.responseStatus.successCode(res, transformedData, "Xử lý thành công ")
            }
        }
        catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMovieScheduleInfo(res: Response, movieId: number) {
        try {
            const findMovie = await this.prisma.phim.findUnique({
                where: {
                    ma_phim: movieId,
                },
                include: {
                    LichChieu: {
                        include: {
                            RapPhim: {
                                include: {
                                    CumRap: {
                                        include: {
                                            HeThongRap: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (findMovie) {
                const heThongRapChieu = findMovie.LichChieu.reduce((result, lichChieu): any => {
                    const heThongRap = lichChieu.RapPhim.CumRap.HeThongRap;
                    const cumRap = lichChieu.RapPhim.CumRap;
                    const rap = lichChieu.RapPhim;

                    let heThongRapExist = result.find(item => item.ma_he_thong_rap === heThongRap.ma_he_thong_rap)
                    if (!heThongRapExist) {
                        heThongRapExist = {
                            maHeThongRap: heThongRap.ma_he_thong_rap,
                            tenHeThongRap: heThongRap.ten_he_thong,
                            logo: heThongRap.logo,
                            cumRapChieu: [],
                        }
                        result.push(heThongRapExist)
                    }

                    let cumRapExists = result.find((item: CumRap) => item.ma_cum_rap === cumRap.ma_cum_rap)
                    if (!cumRapExists) {
                        cumRapExists = {
                            maCumRap: cumRap.ma_cum_rap,
                            tenCumRap: cumRap.ten_cum_rap,
                            // thiếu hihf ảnh
                            diaChi: cumRap.dia_chi,
                            lichChieuPhim: [],
                        };
                        heThongRapExist.cumRapChieu.push(cumRapExists);
                    }

                    cumRapExists.lichChieuPhim.push({
                        maLichChieu: lichChieu.ma_lich_chieu,
                        maRap: rap.ma_rap,
                        tenRap: rap.ten_rap,
                        ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
                        giaVe: lichChieu.gia_ve,
                        // thoiLuong: lichChieu.,
                    });
                    return result;
                }, [])

                this.responseStatus.successCode(res, { heThongRapChieu }, "Xu ly thanh cong")
            } else {
                this.responseStatus.sendNotFoundResponse(res, movieId, "Không tìm thấy mã phim")
            }
        } catch (err) {
            console.log(err)
            this.responseStatus.sendInternalServerErrorResponse(res, "Lỗi backend")
            return;
        }
    }

}

