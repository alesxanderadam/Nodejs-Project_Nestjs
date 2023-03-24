import { UserTokenPayload } from './../../models/user/dto/user.dto';
import { ConverData } from './../../common/translate-data';
import { SignUp } from './../../models/auth/dto/auth.dto';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
import { ResponseService } from './../../common/response-status';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {
    constructor(
        private readonly responseStatus: ResponseService,
    ) { }
    private prisma = new PrismaClient()

    async getListRoleUser(res: Response): Promise<void> {
        try {
            let data = await this.prisma.nguoiDung.findMany({
                select: {
                    loai_nguoi_dung: true
                }
            })
            let uniqueData = [...new Set(data.map(item => item.loai_nguoi_dung))];
            /* vÍ dụ cho hàm trên
             const arr = [1, 2, 2, 3, 3, 3, 4, 5, 5];
            const uniqueArr = [...new Set(arr)]; // [1, 2, 3, 4, 5]
            */
            let result = uniqueData.map(item => {
                const loaiNguoiDung = {
                    maLoaiNguoiDung: item,
                    tenLoai: ConverData.getTenLoaiNguoiDung(item)
                };
                return loaiNguoiDung
            });
            if (result.length > 0) {
                this.responseStatus.successCode(res, result, "Xử lý thành công")
            } else {
                this.responseStatus.successCodeNoData(res, "Không có dữ liệu")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getListUsers(res: Response, keyword: string): Promise<void> {
        try {
            let data = await this.prisma.nguoiDung.findMany({
                where: keyword ? { ho_ten: { contains: keyword } } : undefined
            })
            if (data) {
                return this.responseStatus.successCode(res, plainToClass(SignUp, data, { excludeExtraneousValues: true }), "Xử lý thành công")
            } else {
                return this.responseStatus.successCodeNoData(res, "Không có dữ liệu")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getListUsersPaginating(res: Response, keyword: string, page: number, pageSize: any): Promise<void> {
        try {
            const skip = (page - 1) * pageSize;
            const data = await this.prisma.nguoiDung.findMany({
                where: keyword ? { ho_ten: { contains: keyword } } : undefined,
                skip,
                take: parseInt(pageSize),
            });
            const totalItems = await this.prisma.nguoiDung.count({
                where: keyword ? { ho_ten: { contains: keyword } } : undefined,
            });
            if (data) {
                const totalPages = Math.ceil(totalItems / pageSize);
                const response = {
                    items: plainToClass(SignUp, data, { excludeExtraneousValues: true }),
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

    async searchUser(res: Response, keyword: string): Promise<void> {
        try {
            let data = await this.prisma.nguoiDung.findMany({
                where: keyword ? { ho_ten: { contains: keyword } } : undefined
            })
            if (data) {
                return this.responseStatus.successCode(res, plainToClass(SignUp, data, { excludeExtraneousValues: true }), "Xử lý thành công")
            } else {
                return this.responseStatus.successCodeNoData(res, "Không có dữ liệu")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async searchUserPaginating(res: Response, keyword: string, page: number, pageSize: any): Promise<void> {
        try {
            const skip = (page - 1) * pageSize;
            const data = await this.prisma.nguoiDung.findMany({
                where: keyword ? { ho_ten: { contains: keyword } } : undefined,
                skip,
                take: parseInt(pageSize),
            });
            const totalItems = await this.prisma.nguoiDung.count({
                where: keyword ? { ho_ten: { contains: keyword } } : undefined,
            });
            if (data) {
                const totalPages = Math.ceil(totalItems / pageSize);
                const response = {
                    items: plainToClass(SignUp, data, { excludeExtraneousValues: true }),
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

    async getDetailUser(res: Response, req: UserTokenPayload): Promise<void> {
        let { ma_tai_khoan } = req.user
        try {
            let data = await this.prisma.nguoiDung.findUnique({
                where: { ma_tai_khoan }
            })
            if (data) {
                return this.responseStatus.successCode(res, plainToClass(SignUp, data, { excludeExtraneousValues: true }), "Xử lý thành công")
            } else {
                this.responseStatus.sendBadRequestResponse(res, data, "Không tìm  thấy dữ liêụ")
                return;
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getDetailAccountUser(res: Response, req: UserTokenPayload): Promise<void> {
        let { ma_tai_khoan } = req.user
        try {
            let data = await this.prisma.nguoiDung.findUnique({
                where: { ma_tai_khoan },
                include: {
                    DatVe: {
                        include: {
                            Ghe: true
                        }
                    }
                }
            })
            if (data) {
                const responseData = {
                    taiKhoan: data.tai_khoan,
                    matKhau: data.mat_khau,
                    hoTen: data.ho_ten,
                    email: data.email,
                    soDT: data.so_dt,
                    maLoaiNguoiDung: data.loai_nguoi_dung,
                    loaiNguoiDung: {
                        maLoaiNguoiDung: data.loai_nguoi_dung,
                        tenLoai: ConverData.getTenLoaiNguoiDung(data.loai_nguoi_dung)
                    },
                    thongTinDatVe: data.DatVe
                }
                return this.responseStatus.successCode(res, responseData, "Xử lý thành công")
            } else {
                this.responseStatus.sendBadRequestResponse(res, data, "Không tìm  thấy dữ liêụ")
                return;
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("Lỗi sever", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async addUser(req: UserTokenPayload, res: Response, body: SignUp) {
        try {
            if (req.user) {
                if (body.loai_nguoi_dung === "KhachHang" || body.loai_nguoi_dung === "KhachHang") {
                    const mat_khau = await bcrypt.hash(body.mat_khau, 10);
                    let checkEmailExist = await this.prisma.nguoiDung.findFirst({
                        where: { email: body.email }
                    })
                    let checkAccountExist = await this.prisma.nguoiDung.findFirst({
                        where: { tai_khoan: body.tai_khoan }
                    })
                    if (!checkEmailExist && !checkAccountExist) {
                        let user = await this.prisma.nguoiDung.create({
                            data: { ...body, mat_khau }
                        })
                        if (user) {
                            body.createdAt = new Date();
                            return this.responseStatus.successCode(res, plainToClass(SignUp, body) /*Hàm plainToClass sử dụng bộ biến đổi được định nghĩa trước đó bằng cách sử dụng hàm @Transform để chuyển đổi các thuộc tính của đối tượng thuần túy sang đối tượng của lớp cụ thể. Nếu một thuộc tính trong đối tượng thuần túy không có tương ứng trong lớp cụ thể, thì nó sẽ được bỏ qua.*/, "Tạo người dùng thành công")
                        }
                    } else {
                        if (checkEmailExist) {
                            this.responseStatus.sendConflict(res, body.email, "Email đã được đăng ký")
                        }
                        if (checkAccountExist) {
                            this.responseStatus.sendConflict(res, body.tai_khoan, "Tài khoản đã được đăng ký")
                        }
                        return;
                    }
                } else {
                    return this.responseStatus.sendBadRequestResponse(res, body.loai_nguoi_dung, "Loại người dùng phải là QuanTriVien hoặc KhachHang")
                }
            } else {
                return this.responseStatus.sendFobidden(res, body, "Bạn không có đủ quyền để tạo")
            }

        } catch (err) {
            console.log(err)
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUser(req: UserTokenPayload, res: Response, body: SignUp, id: number) {
        try {
            let checkAuth = await this.prisma.nguoiDung.findFirst({
                where: { ma_tai_khoan: req.user.ma_tai_khoan, loai_nguoi_dung: "QuanTriVien" }
            })
            if (checkAuth) {
                let checkAccountExist = await this.prisma.nguoiDung.findUnique({
                    where: { ma_tai_khoan: id }
                })
                if (checkAccountExist) {
                    const { email: newEmail } = body;
                    const { email: oldEmail } = await this.prisma.nguoiDung.findUnique({
                        where: { ma_tai_khoan: checkAccountExist.ma_tai_khoan },
                    });
                    if (newEmail === oldEmail) {
                        if (body.loai_nguoi_dung === "KhachHang" || body.loai_nguoi_dung === "KhachHang") {
                            const mat_khau = await bcrypt.hash(body.mat_khau, 10);
                            let data = await this.prisma.nguoiDung.update({
                                where: { ma_tai_khoan: checkAccountExist.ma_tai_khoan },
                                data: { ...body, mat_khau }
                            });
                            body.updatedAt = new Date();
                            return this.responseStatus.successCode(res, plainToClass(SignUp, data), "Chỉnh sửa người dùng thành công")
                        } else {
                            return this.responseStatus.sendBadRequestResponse(res, body.loai_nguoi_dung, "Loại người dùng phải là QuanTriVien hoặc KhachHang")
                        }
                    } else {
                        let checkEmailExist = await this.prisma.nguoiDung.findFirst({
                            where: { email: newEmail }
                        })
                        if (checkEmailExist) {
                            return this.responseStatus.sendConflict(res, body.email, "Email đã tồn tại")
                        } else {
                            if (body.loai_nguoi_dung === "KhachHang" || body.loai_nguoi_dung === "KhachHang") {
                                const mat_khau = await bcrypt.hash(body.mat_khau, 10);
                                let data = await this.prisma.nguoiDung.update({
                                    where: { ma_tai_khoan: checkAccountExist.ma_tai_khoan },
                                    data: { ...body, mat_khau }
                                });
                                body.updatedAt = new Date();
                                return this.responseStatus.successCode(res, plainToClass(SignUp, data), "Chỉnh sửa người dùng thành công")
                            } else {
                                return this.responseStatus.sendBadRequestResponse(res, body.loai_nguoi_dung, "Loại người dùng phải là QuanTriVien hoặc KhachHang")
                            }
                        }
                    }
                } else {
                    return this.responseStatus.sendBadRequestResponse(res, body.tai_khoan, "Không tìm thấy dữ liệu")
                }
            } else {
                return this.responseStatus.sendFobidden(res, body, "Bạn không có đủ quyền để tạo")
            }
        } catch (err) {
            console.log(err)
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(id: number, res: Response) {
        try {
            let checkUser = await this.prisma.nguoiDung.findUnique({
                where: { ma_tai_khoan: id }
            })
            if (checkUser) {
                let data = await this.prisma.nguoiDung.delete({ where: { ma_tai_khoan: id } })
                return this.responseStatus.successCode(res, data.ma_tai_khoan, `Người dùng có tài khoản ${id} đã được xóa`)
            } else {
                return this.responseStatus.sendNotFoundResponse(res, `Người dùng có id là ${id} không tồn tại`, "Không tìm thấy dữ liệu")
            }
        } catch (err) {
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
