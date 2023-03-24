import { JwtStrategy } from './../../strategy/jwt.stategy';
import { ResponseService } from './../../common/response-status';
import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, ResponseService, JwtStrategy]
})
export class MovieModule { }
