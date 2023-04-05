import { SignInSwaggerType, SignUpSwaggerType } from '../../models/auth/swagger/auth.swagger';
import { AuthService } from './auth.service';
import { SignIn, SignUp } from '../../models/auth/dto/auth.dto';
import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { Request, Res } from '@nestjs/common/decorators';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('api/Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("SignIn")
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
        description: 'Sign in with email and password',
    })
    async signIn(@Res() res, @Body() body: SignIn): Promise<void> {
        return await this.authService.signIn(res, body)
    }

    @Post("SignUp")
    @ApiBody({ type: SignUpSwaggerType })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Đăng ký thành công',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email đã được đăng ký',
    })
    // @ApiOperation({
    //     summary: 'Sign up user',
    // })
    async signUp(@Request() req, @Res() res: Response, @Body() body: SignUp): Promise<void> {
        return await this.authService.signUp(req, res, body)
    }
}
