import { ApiProperty } from '@nestjs/swagger';
import { SignUpSwaggerType } from './../../auth/swagger/auth.swagger';

export class CreateUserType extends SignUpSwaggerType {
    @ApiProperty({ description: "Loại người dùng", type: String })
    loai_nguoi_dung: string
}

export class UpdateUserType extends CreateUserType {
}

export class DeleteUser {
    @ApiProperty({ description: "Mã người dùng", type: Number })
    ma_tai_khoan: number
}