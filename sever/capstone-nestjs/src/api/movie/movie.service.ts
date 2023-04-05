import { ListMovieResponseDto } from './../../models/movie/dto/movie.dto';
import { BannerResponseDto } from '../../models/movie/dto/movie.dto';
import { plainToInstance, plainToClass } from 'class-transformer';
import { Phim, PrismaClient } from '@prisma/client';
import { ResponseService } from './../../common/response-status';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import { format } from 'date-fns'
import { MovieDto } from 'src/models/movie/swagger/movie-swagger';
import { UserTokenPayload } from 'src/models/user/dto/user.dto';

@Injectable()
export class MovieService {
    constructor(
        private readonly responseStatus: ResponseService) { }
    private prisma = new PrismaClient()
    async getAllBanner(res: Response) {
        try {
            let listBanner = await this.prisma.banner.findMany({
                select: {
                    ma_banner: true,
                    ma_phim: true,
                    Phim: {
                        select: {
                            hinh_anh: true
                        }
                    }
                }
            })
            const result = listBanner.map(banner => plainToInstance(BannerResponseDto, {
                maBanner: banner.ma_banner,
                maPhim: banner.ma_phim,
                hinhAnh: banner.Phim.hinh_anh,
            }));
            if (result) {
                return this.responseStatus.successCode(res, result, "Xử lý thành công");

            } else {
                return this.responseStatus.sendNotFoundResponse(res, result, "Không tìm thấy dữ liệu")
            }
        } catch (err) {
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllMovie(res: Response, keyword: string) {
        try {
            const listMovie = await this.prisma.phim.findMany({
                where: keyword ? { ten_phim: { contains: keyword } } : undefined
            });
            const plainListMovie = plainToClass(ListMovieResponseDto, listMovie, { excludeExtraneousValues: false })
            const processedListMovie = plainListMovie.map(movie => ({ ...movie, biDanh: movie.tenPhim.toLocaleLowerCase().replace(/ /g, "-") }))
            return this.responseStatus.successCode(res, processedListMovie, "Xử lý thành công")

        } catch (err) {
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getDetailMovie(res: Response, id: number): Promise<void> {
        try {
            let data = await this.prisma.phim.findUnique({
                where: { ma_phim: id }
            })
            if (data) {
                return this.responseStatus.successCode(res, plainToClass(ListMovieResponseDto, data, { excludeExtraneousValues: false }), "Xử lý thành công")
            } else {
                this.responseStatus.sendBadRequestResponse(res, data, "Không tìm  thấy dữ liêụ")
                return;
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getListMoviesPaginating(res: Response, keyword: string, page: number, pageSize: any): Promise<void> {
        try {
            const skip = (page - 1) * pageSize;
            const listMovie = await this.prisma.phim.findMany({
                where: keyword ? { ten_phim: { contains: keyword } } : undefined,
                skip,
                take: parseInt(pageSize),
            });
            const totalItems = await this.prisma.phim.count({
                where: keyword ? { ten_phim: { contains: keyword } } : undefined
            });
            if (listMovie) {
                const totalPages = Math.ceil(totalItems / pageSize);
                const response = {
                    items: plainToClass(ListMovieResponseDto, listMovie, { excludeExtraneousValues: true }),
                    currentPage: page,
                    totalPages,
                    pageSize,
                    totalItems,
                };
                const targetDate = moment('2021-12-17T00:00:00.000Z').format('YYYY-MM-DD');
                console.log(targetDate)
                return this.responseStatus.successCode(res, response, "Xử lý thành công")
            } else {
                return this.responseStatus.successCodeNoData(res, "Không có dữ liệu")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getMovieListByDate(res: Response, keyword: string, page: number, pageSize: number, fromDay?: Date, toDay?: Date): Promise<void> {
        try {
            let formattedFromDay: string | undefined;
            let formattedToDay: string | undefined;

            switch (true) {
                case fromDay !== undefined && toDay !== undefined:
                    formattedFromDay = format(new Date(fromDay), 'yyyy-MM-dd');
                    formattedToDay = format(new Date(toDay), 'yyyy-MM-dd');
                    break;
                case fromDay !== undefined:
                    formattedFromDay = format(new Date(fromDay), 'yyyy-MM-dd');
                    break;
                case toDay !== undefined:
                    formattedToDay = format(new Date(toDay), 'yyyy-MM-dd');
                    break;
                default:
                    formattedFromDay = undefined;
                    formattedToDay = undefined;
            }

            const skip = (page - 1) * pageSize;
            /*Sử dụng cú pháp where: { AND: [...] } để tạo ra một mệnh đề AND để lọc các bộ phim có ngày khởi chiếu trong khoảng từ fromDay đến toDay. */
            let whereClause: any = {
                AND: [
                    fromDay && { ngay_khoi_chieu: { gte: formattedFromDay + 'T00:00:00.000Z' } },
                    toDay && { ngay_khoi_chieu: { lte: formattedToDay + 'T00:00:00.000Z' } },
                ],
            };
            if (keyword) {
                whereClause.AND.push({ ten_phim: { contains: keyword } });
            }
            const listMovie = await this.prisma.phim.findMany({
                where: whereClause,
                skip,
                take: pageSize,
            })
            const totalItems = await this.prisma.phim.count({
                where: whereClause
            });
            if (listMovie) {
                const totalPages = Math.ceil(totalItems / pageSize);
                const response = {
                    data: plainToClass(ListMovieResponseDto, listMovie, { excludeExtraneousValues: true }),
                    currentPage: page,
                    totalPages,
                    pageSize,
                    totalItems,
                };
                return this.responseStatus.successCode(res, response, "Xử lý thành công")
            } else {
                return this.responseStatus.successCodeNoData(res, "Không có dữ liệu")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createMovie(file: Express.Multer.File, res: Response, body: MovieDto): Promise<void> {
        try {
            let checkNameMovie = await this.prisma.phim.findFirst({
                where: {
                    ten_phim: body.ten_phim
                }
            })
            if (checkNameMovie) {
                return this.responseStatus.sendConflict(res, checkNameMovie.ten_phim, "Phim đã tồn tại")
            }
            let movieUpdate = await this.prisma.phim.create({
                data: {
                    ten_phim: body.ten_phim,
                    trailer: body.trailer,
                    hinh_anh: process.env.DB_HOST + ":" + process.env.PORT_SERVER + "/" + file.filename,
                    mo_ta: body.mo_ta,
                    ngay_khoi_chieu: format(new Date(body.ngay_khoi_chieu), "yyyy-MM-dd") + 'T00:00:00.000Z',
                    danh_gia: parseInt(body.danh_gia),
                    hot: Boolean(body.hot),
                    dang_chieu: Boolean(body.dang_chieu),
                    sap_chieu: Boolean(body.sap_chieu)
                }
            })
            if (movieUpdate == null) {
                this.responseStatus.sendBadRequestResponse(res, movieUpdate, "Không thể thêm phim");
            } else {
                const plainListMovie = plainToClass(ListMovieResponseDto, movieUpdate, { excludeExtraneousValues: false })
                const processedListMovie = { ...plainListMovie, biDanh: plainListMovie.tenPhim.toLocaleLowerCase().replace(/ /g, "-") }
                return this.responseStatus.successCode(res, processedListMovie, "Xử lý thành công")
            }

        } catch (error) {
            console.log(error)
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async uploadImageMovie(id: number, res: Response, files: Express.Multer.File[]): Promise<void> {
        try {
            let checkMovie = await this.prisma.phim.findUnique({
                where: { ma_phim: id }
            })
            if (!checkMovie) {
                return this.responseStatus.sendNotFoundResponse(res, id, "Không tìm thấy dữ liệu")
            }
            const createImagesMovie = await Promise.all(files.map(async (file) => {
                return await this.prisma.hinhAnhPhim.create({
                    data: { ma_phim: id, duong_dan: process.env.DB_HOST + ":" + process.env.PORT_SERVER + "/" + file.filename }
                })
            }))

            if (createImagesMovie) {
                this.responseStatus.successCode(res, createImagesMovie, "Thêm ảnh thành công")
            } else {
                return this.responseStatus.successCodeNoData(res, "Không tìm thấy dữ liệu")
            }

        } catch (error) {
            console.log(error)
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateMovie(req: UserTokenPayload, idMovie: number, file: Express.Multer.File, res: Response, body: MovieDto): Promise<void> {
        try {
            let checkMovieExists = await this.prisma.phim.findUnique({
                where: { ma_phim: idMovie }
            })
            if (!checkMovieExists) {
                return this.responseStatus.sendNotFoundResponse(res, idMovie, "Không tìm thấy dữ liệu")
            }
            const checkAuth = await this.prisma.nguoiDung.findFirst({
                where: { ma_tai_khoan: req.user.ma_tai_khoan, loai_nguoi_dung: "QuanTriVien" }
            })
            if (!checkAuth) {
                return this.responseStatus.sendFobidden(res, body, "Bạn không có đủ quyền để tạo")
            }
            const { ten_phim: newNameMovie } = body;
            const { ten_phim: oldNameMovie } = checkMovieExists
            if (newNameMovie === oldNameMovie) {
                let movieUpdate = await this.prisma.phim.update({
                    where: {
                        ma_phim: idMovie
                    },
                    data: {
                        ten_phim: body.ten_phim,
                        trailer: body.trailer,
                        hinh_anh: process.env.DB_HOST + ":" + process.env.PORT_SERVER + "/" + file.filename,
                        mo_ta: body.mo_ta,
                        ngay_khoi_chieu: format(new Date(body.ngay_khoi_chieu), "yyyy-MM-dd") + 'T00:00:00.000Z',
                        danh_gia: parseInt(body.danh_gia),
                        hot: Boolean(body.hot),
                        dang_chieu: Boolean(body.dang_chieu),
                        sap_chieu: Boolean(body.sap_chieu)
                    }
                })
                if (movieUpdate == null) {
                    this.responseStatus.sendBadRequestResponse(res, movieUpdate, "Không thể thêm phim");
                } else {
                    const plainListMovie = plainToClass(ListMovieResponseDto, movieUpdate, { excludeExtraneousValues: false })
                    const processedListMovie = { ...plainListMovie, biDanh: plainListMovie.tenPhim.toLocaleLowerCase().replace(/ /g, "-") }
                    return this.responseStatus.successCode(res, processedListMovie, "Xử lý thành công")
                }
            } else {
                let checkExistNameMovie = await this.prisma.phim.findFirst({
                    where: { ten_phim: body.ten_phim }
                })
                if (checkExistNameMovie) {
                    return this.responseStatus.sendConflict(res, checkExistNameMovie.ten_phim, 'Tên phim đã tồn tại')
                }

                let movieUpdate = await this.prisma.phim.update({
                    where: {
                        ma_phim: idMovie
                    },
                    data: {
                        ten_phim: body.ten_phim,
                        trailer: body.trailer,
                        hinh_anh: process.env.DB_HOST + ":" + process.env.PORT_SERVER + "/" + file.filename,
                        mo_ta: body.mo_ta,
                        ngay_khoi_chieu: format(new Date(body.ngay_khoi_chieu), "yyyy-MM-dd") + 'T00:00:00.000Z',
                        danh_gia: parseInt(body.danh_gia),
                        hot: Boolean(body.hot),
                        dang_chieu: Boolean(body.dang_chieu),
                        sap_chieu: Boolean(body.sap_chieu)
                    }
                })
                if (movieUpdate == null) {
                    this.responseStatus.sendBadRequestResponse(res, movieUpdate, "Không thể thêm phim");
                } else {
                    const plainListMovie = plainToClass(ListMovieResponseDto, movieUpdate, { excludeExtraneousValues: false })
                    const processedListMovie = { ...plainListMovie, biDanh: plainListMovie.tenPhim.toLocaleLowerCase().replace(/ /g, "-") }
                    return this.responseStatus.successCode(res, processedListMovie, "Xử lý thành công")
                }
            }
        } catch (error) {
            console.log(error)
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteMovie(id: number, res: Response) {
        try {
            let checkMovie = await this.prisma.phim.findUnique({
                where: { ma_phim: id },
            })

            let checkBanner = await this.prisma.banner.findFirst({
                where: { ma_phim: id }
            })

            let checkLichChieu = await this.prisma.lichChieu.findFirst({
                where: { ma_phim: id }
            })

            if (checkMovie !== null) {
                const dataBanner = await this.prisma.banner.findMany({
                    where: { ma_phim: id, ma_banner: checkBanner.ma_banner },
                });
                const dataLichChieu = await this.prisma.lichChieu.findMany({
                    where: { ma_phim: id, ma_lich_chieu: checkLichChieu.ma_lich_chieu, ma_rap: checkLichChieu.ma_rap },
                });

                switch (true) {
                    case dataBanner.length > 0 && dataLichChieu.length > 0:
                        await this.prisma.banner.delete({
                            where: { ma_banner: checkBanner.ma_banner }
                        });

                        await this.prisma.lichChieu.delete({
                            where: { ma_lich_chieu: checkLichChieu.ma_lich_chieu }
                        })

                        await this.prisma.phim.delete({ where: { ma_phim: id } })
                        break;
                    case dataBanner.length > 0 && dataLichChieu.length < 0:
                        await this.prisma.banner.delete({
                            where: { ma_banner: checkBanner.ma_banner }
                        });

                        await this.prisma.phim.delete({ where: { ma_phim: id } })
                        break;
                    case dataBanner.length < 0 && dataLichChieu.length > 0:
                        await this.prisma.lichChieu.delete({
                            where: { ma_lich_chieu: checkLichChieu.ma_lich_chieu }
                        })

                        await this.prisma.phim.delete({ where: { ma_phim: id } })
                        break;
                    default:
                        await this.prisma.phim.delete({ where: { ma_phim: id } })
                }


                return this.responseStatus.successCode(res, id, `Phim có mã là ${id} đã được xóa`)
            } else {
                return this.responseStatus.sendNotFoundResponse(res, `Phim có mã là ${id} không tồn tại`, "Không tìm thấy dữ liệu")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
