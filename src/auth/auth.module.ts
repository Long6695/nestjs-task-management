import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { Auth } from './auth.entity';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { UserRepository } from '../repositories/user/user.repository';
import { AuthRepository } from '../repositories/auth/auth.repository';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Auth]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    ConfigService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    AuthRepository,
    UserRepository,
  ],
})
export class AuthModule {}
