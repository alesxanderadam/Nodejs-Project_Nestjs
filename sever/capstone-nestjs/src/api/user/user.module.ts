import { JwtStrategy } from './../../strategy/jwt.stategy';
import { ResponseService } from './../../common/response-status';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ResponseService, JwtStrategy]
})
export class UserModule { }
