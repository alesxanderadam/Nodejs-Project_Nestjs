import { ApiProperty } from "@nestjs/swagger"

export class SignInSwaggerType {
    @ApiProperty({ description: "email", type: String })
    email: string

    @ApiProperty({ description: "Mật khẩu", type: String })
    mat_khau: string
}

export class SignUpSwaggerType extends SignInSwaggerType {
    @ApiProperty({ description: "Họ tên", type: String })
    ho_ten: string

    @ApiProperty({ description: "Số điện thoại", type: String })
    so_dt: string

    @ApiProperty({ description: "Loại người dùng", type: String })
    loai_nguoi_dung: string
}