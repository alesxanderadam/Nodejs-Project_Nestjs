import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { Controller, Get, Res, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { Param } from '@nestjs/common/decorators';

@ApiBearerAuth()
@UseGuards(AuthGuard(("jwt")))
@ApiTags("Movie-Management")
@Controller('api/Movie')
export class MovieController {
    constructor(readonly movieService: MovieService) { }

    @Get("GetListBanner")
    async getListBanner(@Res() res: Response): Promise<void> {
        return await this.movieService.getAllBanner(res)
    }


    @Get("GetListMovies")
    @ApiQuery({ name: 'keyword', required: false, description: 'Enter to search includes name movie' })
    async getAllMovie(@Res() res: Response, @Query("keyword") keyword?: string): Promise<void> {
        return await this.movieService.getAllMovie(res, keyword)
    }

    @Get("GetDetailMovie/:id")
    async getDetailMovie(@Res() res: Response, @Param("id", ParseIntPipe) id: number): Promise<void> {
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
}
