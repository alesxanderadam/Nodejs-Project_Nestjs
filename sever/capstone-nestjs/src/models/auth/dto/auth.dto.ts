import { Exclude, Expose, Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/base.dto";

export class SignIn {
    @IsEmail()
    @Expose() // nếu để xpose thì chỗ này sẽ được trả ra khi đăng ký thanahf công
    email: string;

    @IsNotEmpty()
    // @Expose()
    mat_khau: string;
}

export class SignUp extends SignIn implements BaseDto {
    @IsNotEmpty()
    /* @Expose không cần để vào cug được nó dóng vai trò chỉ định trường này sẽ được show ra */
    // @Expose()
    ho_ten: string;

    @Exclude()
    ten_dau: string;

    @Exclude()
    ten_cuoi: string;

    // @Expose()
    @Transform(({ obj }) => obj.ten_dau + " " + obj.ten_cuoi)
    ho_ten_day_du: string

    @IsNotEmpty()
    // @Expose()
    so_dt: string;

    @IsNotEmpty()
    // @Expose()
    loai_nguoi_dung: string;

    // @Expose()
    createdAt: Date;

    // @Expose()
    updatedAt: Date;

}

export interface DecodedToken {
    data: object;
    iat: number;
    exp: number;
}