import { MovieModule } from './api/movie/movie.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    MovieModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
