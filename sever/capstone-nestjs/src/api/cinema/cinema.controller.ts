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

    @Get("GetDetailCinema/:CinemaId")
    @ApiParam({ name: "CinemaId", description: "Get detail cenema by CinemaId" })
    async getDetailCenema(@Res() res: Response, @Param("CinemaId") id: string): Promise<void> {
        return await this.cinemaService.getDetailCenema(res, id)
    }

    @Get("GetMovieScheduleSystemInfo/:CinemaId")
    @ApiParam({ name: "CinemaId", description: "Get movie schedule system by CinemaId" })
    async getMovieScheduleSystemInfo(@Res() res: Response, @Param("CinemaId") id: string): Promise<void> {
        return await this.cinemaService.getMovieScheduleSystemInfo(res, id)
    }


    @Get("GetMovieScheduleInfo/:IdMovie")
    @ApiParam({ name: "IdMovie", description: "Get movie schedule by IdMovie" })
    async getMovieScheduleInfo(@Res() res: Response, @Param("IdMovie", ParseIntPipe) id: number): Promise<void> {
        return await this.cinemaService.getMovieScheduleInfo(res, id)
    }
}
