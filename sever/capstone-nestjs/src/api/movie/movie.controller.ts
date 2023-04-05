import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody, ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { Controller, Get, Res, UseGuards, Query, ParseIntPipe, Post, UseInterceptors, UploadedFile, UploadedFiles, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Body, Delete, Param, Put, Req } from '@nestjs/common/decorators';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { MovieDto } from 'src/models/movie/swagger/movie-swagger';
import { UserTokenPayload } from 'src/models/user/dto/user.dto';
import { ResponseService } from 'src/common/response-status';

@ApiBearerAuth()
@UseGuards(AuthGuard(("jwt")))
@ApiTags("Movie-Management")
@Controller('api/Movie')
export class MovieController {
    constructor(
        readonly movieService: MovieService,
        private responseStatus: ResponseService
    ) { }




    @Get("GetListBanner")
    async getListBanner(@Res() res: Response): Promise<void> {
        return await this.movieService.getAllBanner(res)
    }


    @Get("GetListMovies")
    @ApiQuery({ name: 'keyword', required: false, description: 'Enter to search includes name movie' })
    async getAllMovie(@Res() res: Response, @Query("keyword") keyword?: string): Promise<void> {
        return await this.movieService.getAllMovie(res, keyword)
    }

    @Get("GetDetailMovie/:IdMovie")
    async getDetailMovie(@Res() res: Response, @Param("IdMovie", ParseIntPipe) id: number): Promise<void> {
        return await this.movieService.getDetailMovie(res, id)
    }

    @Get("GetListMoviesPaginating")
    @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword include movie name' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page' })
    async getAllMoviesPaginating(
        @Res() res: Response,
        @Query("keyword") keyword: string,
        @Query("page") page: number = 1,
        @Query("pageSize") pageSize: number = 10,
    ): Promise<void> {
        return await this.movieService.getListMoviesPaginating(res, keyword, page, pageSize);
    }

    @Get("GetMovieListByDate")
    @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword include movie name' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page' })
    @ApiQuery({ name: 'fromDay', required: false, description: 'Enter the date to search' })
    @ApiQuery({ name: 'toDay', required: false, description: 'Enter the end date' })
    async getMovieListByDate(
        @Res() res: Response,
        @Query("keyword") keyword: string,
        @Query("page") page: number = 1,
        @Query("pageSize") pageSize: number = 10,
        @Query("fromDay") fromDay: Date,
        @Query("toDay") toDay: Date
    ): Promise<void> {
        return await this.movieService.getMovieListByDate(res, keyword, page, pageSize, fromDay, toDay);
    }


    @Post("CreateMovie")
    @UseInterceptors(FileInterceptor("hinh_anh", {
        storage: diskStorage({
            destination: process.cwd() + "/public/images/",
            filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: MovieDto })
    async createMovie(@UploadedFile() file: Express.Multer.File, @Res() res: Response, @Body() body: MovieDto): Promise<void> {
        try {
            const movie = await this.movieService.createMovie(file, res, body);

            return movie;
        } catch (error) {
            console.log(error);
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("UploadImagesMovie/:IdMovie")
    @UseInterceptors(FilesInterceptor("files", 20, {
        storage: diskStorage({
            destination: process.cwd() + "/public/images/",
            filename: (req, files, callback) => callback(null, Date.now() + "_" + files.originalname)
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Multiple files input',
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @ApiParam({ name: "IdMovie", description: "Enter id movie to upload image this movie" })
    async uploadImageMovie(
        @Param("IdMovie", ParseIntPipe) id: number,
        @Res() res: Response,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ): Promise<void> {
        return await this.movieService.uploadImageMovie(id, res, files);
    }

    @Put("UpdateMovie/:IdMovie")
    @UseInterceptors(FileInterceptor("hinh_anh", {
        storage: diskStorage({
            destination: process.cwd() + "/public/images/",
            filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: "IdMovie", description: "Enter id movie to upload image this movie" })
    @ApiBody({ type: MovieDto })
    async updateMovie(@Req() req: UserTokenPayload, @Param("IdMovie", ParseIntPipe) IdMovie: number, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Body() body: MovieDto): Promise<void> {
        try {
            return await this.movieService.updateMovie(req, IdMovie, file, res, body)
        } catch (error) {
            console.error(error);
            throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete("DeleteUser/:IdMovie")
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Xóa phim thành công',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Phim không tồn tại',
    })
    @ApiOperation({
        summary: 'Delete movie',
    })

    async deleteUser(
        @Req() req: UserTokenPayload,
        @Param("IdMovie", ParseIntPipe) id: number, @Res() res: Response): Promise<void> {
        return await this.movieService.deleteMovie(req, id, res)
    }


}
