import { JwtStrategy } from './../../strategy/jwt.stategy';
import { ResponseService } from './../../common/response-status';
import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';

@Module({
  controllers: [CinemaController],
  providers: [
    CinemaService,
    ResponseService,
    JwtStrategy,
  ]
})
export class CinemaModule { }
