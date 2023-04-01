import { ListMovieResponseDto } from './../../models/movie/dto/movie.dto';
import { BannerResponseDto } from '../../models/movie/dto/movie.dto';
import { plainToInstance, plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
import { ResponseService } from './../../common/response-status';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import { format } from 'date-fns'

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


    async uploadImageMovie(id: number, res: Response, file: Express.Multer.File): Promise<void> {
        try {
            let checkMovie = await this.prisma.phim.findUnique({
                where: { ma_phim: id }
            })
            if (!checkMovie) {
                return this.responseStatus.sendNotFoundResponse(res, id, "Không tìm thấy dữ liệu")
            }
            let createImagesMovie = await this.prisma.hinhAnhPhim.create({
                data: { ma_phim: id, duong_dan: process.env.DB_HOST + ":" + process.env.PORT_SERVER + "/" + file.filename }
            })

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
}
