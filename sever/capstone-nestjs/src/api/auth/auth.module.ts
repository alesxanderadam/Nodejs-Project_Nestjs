import { JwtStrategy } from './../../strategy/jwt.stategy';
import { ResponseService } from './../../common/response-status';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, ResponseService, JwtStrategy]
})
export class AuthModule { }
