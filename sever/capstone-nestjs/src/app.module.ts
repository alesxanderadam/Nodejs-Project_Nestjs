import { JwtStrategy } from './strategy/jwt.stategy';
import { ResponseService } from './common/response-status';
import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
