import { TicketModule } from './api/ticket/ticket.module';
import { CinemaModule } from './api/cinema/cinema.module';
import { MovieModule } from './api/movie/movie.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { Application } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    MovieModule,
    CinemaModule,
    TicketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
