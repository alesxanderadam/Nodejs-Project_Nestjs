import { UserTokenPayload } from './../../models/user/dto/user.dto';
import { PrismaClient } from '@prisma/client';
import { ResponseService } from './../../common/response-status';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { format } from 'date-fns';
import { CreateMovieShowTimes } from 'src/models/ticket/swagger/ticket-swagger';

@Injectable()
export class TicketService {
    constructor(
        private readonly responseStatus: ResponseService,
    ) { }
    private prisma = new PrismaClient()


    async getTicketOfficeList(res: Response): Promise<void> {
        try {
            const listTicket = await this.prisma.phim.findMany({
                select: {
                    LichChieu: {
                        select: {
                            DatVe: true,
                            ma_lich_chieu: true,
                            ngay_gio_chieu: true,
                            gia_ve: true,
                            Phim: {
                                select: {
                                    ten_phim: true,
                                    hinh_anh: true,
                                }
                            },
                            RapPhim: {
                                select: {
                                    ten_rap: true,
                                    CumRap: {
                                        select: {
                                            ten_cum_rap: true,
                                            dia_chi: true
                                        }
                                    },
                                    Ghe: true
                                }
                            }
                        }
                    },
                }
            })

            const transformedData = listTicket.flatMap((cinema) =>
                cinema.LichChieu.map((lichChieu) => {
                    const thongTinPhim = {
                        maLichChieu: lichChieu.ma_lich_chieu,
                        tenCumRap: lichChieu.RapPhim.CumRap.ten_cum_rap,
                        tenRap: lichChieu.RapPhim.ten_rap,
                        diaChi: lichChieu.RapPhim.CumRap.dia_chi,
                        tenPhim: lichChieu.Phim.ten_phim,
                        hinhAnh: lichChieu.Phim.hinh_anh,
                        ngayChieu: new Date(lichChieu.ngay_gio_chieu).toLocaleDateString(),
                        gioChieu: new Date(lichChieu.ngay_gio_chieu).toLocaleTimeString(),
                    };

                    const danhSachGhe = lichChieu.RapPhim.Ghe.map((ghe) => {
                        let daDat = false;
                        let taiKhoanNguoiDat = null;
                        let checkDatVe = lichChieu.DatVe

                        // Kiểm tra ghế đã được đặt hay chưa
                        checkDatVe.forEach((ve) => {
                            if (ve.ma_ghe === ghe.ma_ghe) {
                                daDat = true;
                                taiKhoanNguoiDat = ve.ma_tai_khoan;
                            }
                        });

                        return {
                            maGhe: ghe.ma_ghe,
                            tenGhe: ghe.ten_ghe,
                            maRap: ghe.ma_rap,
                            loaiGhe: ghe.loai_ghe,
                            stt: ghe.ten_ghe.slice(-2),
                            giaVe: lichChieu.gia_ve,
                            daDat,
                            taiKhoanNguoiDat,
                        };
                    });

                    const combinedData = {
                        thongTinPhim,
                        danhSachGhe
                    };

                    return combinedData;
                }))

            this.responseStatus.successCode(res, transformedData, "Xử ly thanh cong")
        } catch (error) {
            console.log(error)
            this.responseStatus.sendInternalServerErrorResponse(res, "Lỗi backend")
            return;
        }
    }

    async createTicket(req: UserTokenPayload, res: Response, body: any): Promise<void> {
        try {
            const checkMaChieu = await this.prisma.lichChieu.findMany({
                where: {
                    ma_lich_chieu: parseInt(body.maLichChieu),
                    gia_ve: parseInt(body.danhSachVe[0].giaVe),
                    RapPhim: {
                        Ghe: {
                            some: {
                                ma_ghe: parseInt(body.danhSachVe[0].maGhe)
                            }
                        }
                    }
                }
            });

            if (checkMaChieu.length > 0) {
                const getGhe = await this.prisma.ghe.findUnique({
                    where: { ma_ghe: parseInt(body.danhSachVe[0].maGhe) }
                });
                let checkTicket = await this.prisma.datVe.findMany({
                    where: { ma_ghe: getGhe.ma_ghe, ma_lich_chieu: body.maLichChieu }
                })
                if (checkTicket.length > 0) {
                    this.responseStatus.sendConflict(res, body.maGhe, "Ghế này đã được đặt")
                    return;
                }
                const bookTicket = await this.prisma.datVe.create({
                    data: { ma_ghe: getGhe.ma_ghe, ma_lich_chieu: body.maLichChieu, ma_tai_khoan: req.user.ma_tai_khoan }
                })
                if (bookTicket) {
                    this.responseStatus.successCode(res, bookTicket, "Đặt vé thành công")
                } else {
                    this.responseStatus.successCodeNoData(res, "Không có dữ liệu")
                }
            } else {
                this.responseStatus.sendNotFoundResponse(res, null, "Không tìm thấy dữ liệu")
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createMovieShowTimes(req: UserTokenPayload, res: Response, body: CreateMovieShowTimes) {
        try {
            const checkRole = await this.prisma.nguoiDung.findFirst({
                where: { ma_tai_khoan: req.user.ma_tai_khoan, loai_nguoi_dung: "QuanTriVien" }
            });

            if (!checkRole) {
                return this.responseStatus.sendFobidden(res, checkRole.loai_nguoi_dung, "Bạn không có đủ quyền để tạo");
            }

            const existingShowTimes = await this.prisma.lichChieu.findMany({
                where: {
                    ma_rap: body.maRap,
                    ma_phim: body.maPhim
                }
            });

            let checkExistIdMovie = await this.prisma.phim.findUnique({
                where: { ma_phim: body.maPhim }
            })

            let checkExistIdCinema = this.prisma.rapPhim.findUnique({
                where: { ma_rap: body.maRap }
            })

            if (!checkExistIdMovie && !checkExistIdCinema) {
                return this.responseStatus.sendNotFoundResponse(res, null, "Không tìm thấy mã phim và mã rạp")
            } else if (!checkExistIdMovie) {
                return this.responseStatus.sendBadRequestResponse(res, null, "Không tìm thấy mã phim")
            } else if (!checkExistIdCinema) {
                return this.responseStatus.sendBadRequestResponse(res, null, "Không tìm thấy mã rạp")
            }


            if (existingShowTimes.length > 0) {
                this.responseStatus.sendConflict(res, existingShowTimes, "Lịch chiếu đã tồn tại");
                return;
            }

            const newShowTime = await this.prisma.lichChieu.create({
                data: {
                    ma_rap: body.maRap,
                    ma_phim: body.maPhim,
                    ngay_gio_chieu: new Date(body.ngayGioChieu),
                    gia_ve: body.giaVe
                }
            });

            if (newShowTime) {
                this.responseStatus.successCode(res, newShowTime, "Tạo lịch chiếu thành công");
            } else {
                this.responseStatus.successCodeNoData(res, "Không có dữ liệu");
                return;
            }
        } catch (error) {
            console.log(error);
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

