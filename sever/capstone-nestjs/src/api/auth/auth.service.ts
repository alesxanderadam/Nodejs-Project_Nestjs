import { plainToInstance, plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
import { ResponseService } from '../../common/response-status';
import { SignIn, SignUp } from '../../models/auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        private jwt: JwtService,
        private readonly res: ResponseService
    ) { }

    private prisma = new PrismaClient()

    async signIn(res, { email, mat_khau }: SignIn): Promise<void> {
        try {
            const user = await this.prisma.nguoiDung.findFirst({
                where: { email }
            })
            if (user) {
                let checkPassword = bcrypt.compareSync(mat_khau, user.mat_khau);
                if (checkPassword) {
                    const token = this.jwt.sign({ sub: user.email }, { secret: this.config.get("JWT_SECRET"), expiresIn: this.config.get("JWT_EXPIRATION_TIME") })
                    return this.res.successCode(res, token, "Xử lý thành công")
                } else {
                    return this.res.sendBadRequestResponse(res, { email, mat_khau }, "Sai mật khẩu")
                }
            } else {
                return this.res.sendBadRequestResponse(res, { email }, "Người dùng không tồn tại")
            }
        } catch (err) {
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    async signUp(res, body: SignUp) {
        try {
            const mat_khau = await bcrypt.hash(body.mat_khau, 10);
            let checkEmail = await this.prisma.nguoiDung.findFirst({
                where: { email: body.email }
            })
            if (!checkEmail) {
                let user = await this.prisma.nguoiDung.create({
                    data: { ...body, mat_khau }
                })
                if (user) {
                    body.createdAt = new Date();
                    /* Test @Tranform lấy 2 trường gộp lại và show lên cho người dùng
                    body.ten_dau = "Lê"
                    body.ten_cuoi = "Huy Đẹp Trai" 
                    */
                    return this.res.successCode(res, plainToClass(SignUp, body) /*Hàm plainToClass sử dụng bộ biến đổi được định nghĩa trước đó bằng cách sử dụng hàm @Transform để chuyển đổi các thuộc tính của đối tượng thuần túy sang đối tượng của lớp cụ thể. Nếu một thuộc tính trong đối tượng thuần túy không có tương ứng trong lớp cụ thể, thì nó sẽ được bỏ qua.*/, "Tạo người dùng thành công")
                }
            } else {
                this.res.sendConflict(res, body.email, "Email đã được đăng ký")
                return;
            }
        } catch (err) {
            console.log(err)
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
