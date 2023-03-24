import { ApiProperty } from "@nestjs/swagger"

export class SignInSwaggerType {
    @ApiProperty({ description: "Tài khoản", type: String })
    tai_khoan: string

    @ApiProperty({ description: "Mật khẩu", type: String })
    mat_khau: string
}

export class SignUpSwaggerType extends SignInSwaggerType {
    @ApiProperty({ description: "Họ tên", type: String })
    ho_ten: string

    @ApiProperty({ description: "Email", type: String })
    email: string

    @ApiProperty({ description: "Số điện thoại", type: String })
    so_dt: string
}