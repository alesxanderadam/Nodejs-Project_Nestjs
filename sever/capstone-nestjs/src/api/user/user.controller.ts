import { CreateUserType, UpdateUserType, DeleteUser } from './../../models/user/swagger/user.swagger';
import { SignUp } from './../../models/auth/dto/auth.dto';
import { UserTokenPayload } from './../../models/user/dto/user.dto';
import { UserService } from './user.service';
import { Controller, Get, Post, Put, Query, Request, Res, UseGuards, HttpStatus, Body, Param, ParseIntPipe, Delete, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiBody, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';



// @ApiHeader({
//     name: 'Authorization',
//     description: 'Token',
// })
@ApiBearerAuth()
@UseGuards(AuthGuard(("jwt"))) //chữ jwt có thể đổi nó ánh xạ qua tham số thứ 2 của jwt.stategy.ts chỗ hàm PassportStrategy(Strategy, tham số thứ 2 là tên cần đổi nếu không khai báo mặc định sẽ là jwt)
@ApiTags("User Management")
@Controller('api/User')
export class UserController {
    constructor(readonly userService: UserService) { }

    @Get("GetListOfUserTypes")
    async getListRoleUser(@Res() res: Response): Promise<void> {
        return await this.userService.getListRoleUser(res)
    }

    @Get("GetListUsers") // Nên dùng @ApiQuery trong trường hợp này mới có thể cho người dùng nếu không nhập keyword thì sẽ get all còn nếu nhập thì sẽ tìm theo keyword và url sẽ là ...api?keyword={keyword}
    @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword include user name' })
    async getListUsers(@Req() req: UserTokenPayload, @Res() res: Response, @Query("keyword") keyword?: string): Promise<void> {
        return await this.userService.getListUsers(req, res, keyword)
    }

    @Get("GetListUsersPaginating")
    @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword include user name' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page' })
    async getListUsersPaginating(
        @Req() req: UserTokenPayload,
        @Res() res: Response,
        @Query("keyword") keyword?: string,
        @Query("page") page: number = 1,
        @Query("pageSize") pageSize: number = 10
    ): Promise<void> {
        return await this.userService.getListUsersPaginating(req, res, keyword, page, pageSize);
    }

    @Get("SearchUser")
    @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword include user name' })
    async searchUser(@Req() req: UserTokenPayload, @Res() res: Response, @Query("keyword") keyword?: string): Promise<void> {
        return await this.userService.searchUser(req, res, keyword)
    }

    @Get("SearchUserPaginating")
    @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword include user name' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page' })
    async searchUserPaginating(
        @Req() req: UserTokenPayload,
        @Res() res: Response,
        @Query("keyword") keyword?: string,
        @Query("page") page: number = 1,
        @Query("pageSize") pageSize: number = 10
    ): Promise<void> {
        return await this.userService.searchUserPaginating(req, res, keyword, page, pageSize)
    }

    @Get("GetDetailUser/:UserId")
    async getDetailUser(@Param("UserId", ParseIntPipe) id: number, @Res() res: Response, @Request() req: UserTokenPayload): Promise<void> {
        return await this.userService.getDetailUser(id, res, req)
    }


    @Get("GetInformationAccountUser")
    async getDetailAccountUser(@Res() res: Response, @Request() req: UserTokenPayload): Promise<void> {
        return await this.userService.getDetailAccountUser(res, req)
    }


    @Post("CreateUser")
    @ApiBody({ type: CreateUserType })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Đăng ký thành công',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email đã được đăng ký',
    })
    // @ApiOperation({
    //     summary: 'Create user',
    // })
    async addUser(@Request() req: UserTokenPayload, @Res() res: Response, @Body() body: SignUp): Promise<void> {
        return await this.userService.addUser(req, res, body)
    }

    @Put("UpdateUser/:UserId")
    @ApiBody({ type: UpdateUserType })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Chỉnh sửa người dùng thành công',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email đã được đăng ký',
    })
    // @ApiOperation({
    //     summary: 'Update user',
    // })
    async updateUser(
        @Request() req: UserTokenPayload,
        @Param("UserId", ParseIntPipe) id: number,
        @Res() res: Response,
        @Body() body: SignUp
    ): Promise<void> {
        return await this.userService.updateUser(req, res, body, id)
    }

    @Delete("DeleteUser/:UserId")
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Xóa người dùng thành công',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Người dùng không tồn tại',
    })
    // @ApiOperation({
    //     summary: 'Delete user',
    // })

    async deleteUser(
        @Param("UserId", ParseIntPipe) id: number, @Res() res: Response): Promise<void> {
        return await this.userService.deleteUser(id, res)
    }
}
