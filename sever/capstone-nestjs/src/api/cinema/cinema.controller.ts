import { CinemaService } from './cinema.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query, Res, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';



@ApiBearerAuth()
@UseGuards(AuthGuard(("jwt")))
@ApiTags("Cinema-Management")
// @UseInterceptors(AddAliasInterceptor)
@Controller('api/Cinema')
export class CinemaController {
    constructor(readonly cinemaService: CinemaService) { }

    @Get("GetListCinema")
    @ApiQuery({ name: 'nameCinema', required: false, description: 'Enter to search includes name cinema' })
    async getAllMovie(@Res() res: Response, @Query("nameCinema") keyword?: string): Promise<void> {
        return await this.cinemaService.getAllCinema(res, keyword)
    }

    @Get("GetDetailCinema/:id")
    @ApiParam({ name: "id", description: "Get detail cenema by id" })
    async getDetailCenema(@Res() res: Response, @Param("id") id: string): Promise<void> {
        return await this.cinemaService.getDetailCenema(res, id)
    }

    @Get("GetMovieScheduleSystemInfo/:id")
    @ApiParam({ name: "id", description: "Get movie schedule system by id" })
    async getMovieScheduleSystemInfo(@Res() res: Response, @Param("id") id: string): Promise<void> {
        return await this.cinemaService.getMovieScheduleSystemInfo(res, id)
    }


    @Get("GetMovieScheduleInfo/:id")
    @ApiParam({ name: "id", description: "Get movie schedule by id" })
    async getMovieScheduleInfo(@Res() res: Response, @Param("id", ParseIntPipe) id: number): Promise<void> {
        return await this.cinemaService.getMovieScheduleInfo(res, id)
    }
}
