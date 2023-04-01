import { JwtModule } from '@nestjs/jwt';
import { ResponseService } from './../../common/response-status';
import { JwtStrategy } from './../../strategy/jwt.stategy';
import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TicketController],
  providers: [TicketService, ResponseService, JwtStrategy]
})
export class TicketModule { }
