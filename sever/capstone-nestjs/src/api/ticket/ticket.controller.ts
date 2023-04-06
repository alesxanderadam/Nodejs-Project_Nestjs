import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { Controller, UseGuards } from '@nestjs/common';
import { Body, Get, Post, Res, Request } from '@nestjs/common/decorators';
import { Response } from 'express';
import { CreateMovieShowTimes, TicketDto } from 'src/models/ticket/swagger/ticket-swagger';
import { UserTokenPayload } from 'src/models/user/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard(("jwt")))
@ApiTags('Ticket-Management')
@Controller('api/ManagermentTicket')
export class TicketController {
    constructor(private readonly ticketService: TicketService) { }

    @Get("GetTicketOfficeList")
    async getTicketOfficeList(@Res() res: Response): Promise<void> {
        return await this.ticketService.getTicketOfficeList(res)
    }

    @Post("BookTickets")
    @ApiBody({ type: TicketDto })
    async createTicket(@Request() req: UserTokenPayload, @Res() res: Response, @Body() body: any): Promise<void> {
        return await this.ticketService.createTicket(req, res, body)
    }

    @Post("CreateMovieShowTimes")
    @ApiBody({ type: CreateMovieShowTimes })
    async createMovieShowTimes(@Request() req: UserTokenPayload, @Res() res: Response, @Body() body: CreateMovieShowTimes): Promise<void> {
        return await this.ticketService.createMovieShowTimes(req, res, body)
    }
}