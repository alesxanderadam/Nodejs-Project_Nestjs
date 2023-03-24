import { Expose, Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/base.dto";
import { ConverData } from "src/common/translate-data";
export class SignIn {
    @Expose() // nếu để xpose thì chỗ này sẽ được trả ra khi đăng ký thanahf công
    @IsNotEmpty()
    tai_khoan: string;

    @IsNotEmpty()
    mat_khau: string;
}

export class SignUp extends SignIn implements BaseDto {
    @IsNotEmpty()
    @Expose()
    ho_ten: string;

    @Expose()
    @IsEmail()
    email: string;

    @Expose()
    @IsNotEmpty()
    so_dt: string;

    @Expose()
    @Transform(({ value }) => ({
        maLoaiNguoiDung: value,
        tenLoai: ConverData.getTenLoaiNguoiDung(value)
    }))
    loai_nguoi_dung: string;

    @Expose()
    loaiNguoiDung: {
        maLoaiNguoiDung: string;
        tenLoai: string;
    };

    // ten_dau: string;

    // ten_cuoi: string;

    // @Transform(({ obj }) => obj.ten_dau + " " + obj.ten_cuoi)
    // ho_ten_day_du: string

    createdAt: Date;

    updatedAt: Date;

}

export interface DecodedToken {
    data: object;
    iat: number;
    exp: number;
}