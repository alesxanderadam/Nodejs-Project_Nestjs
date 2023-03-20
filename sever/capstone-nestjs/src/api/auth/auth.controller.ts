import { SignInSwaggerType, SignUpSwaggerType } from '../../models/auth/swagger/auth.swagger';
import { AuthService } from './auth.service';
import { ResponseService } from '../../common/response-status';
import { SignIn, SignUp } from '../../models/auth/dto/auth.dto';
import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly res: ResponseService,
        private readonly authService: AuthService
    ) { }

    @Post("signIn")
    @ApiBody({ type: SignInSwaggerType })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Đăng nhập thành công',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Tên đăng nhập hoặc mật khẩu không chính xác',
    })
    @ApiOperation({
        summary: 'Đăng nhập',
        description: 'Đăng nhập vào hệ thống với tên đăng nhập và mật khẩu',
    })
    async signIn(@Res() res, @Body() body: SignIn): Promise<void> {
        return await this.authService.signIn(res, body)
    }

    @Post("signUp")
    @ApiBody({ type: SignUpSwaggerType })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Đăng ký thành công',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email đã được đăng ký',
    })
    @ApiOperation({
        summary: 'Đăng ký người dùng',
    })
    @Post("signUp")
    async signUp(@Res() res, @Body() body: SignUp): Promise<void> {
        return await this.authService.signUp(res, body)
    }
}
