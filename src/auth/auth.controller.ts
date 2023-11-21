import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { User } from '../users/user.entity';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { HttpStatus } from '../constants/http-status';
import { ResponseMessage } from '../decorators/response.decorator';
import { AUTH_MESSAGE } from '../constants/auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(AUTH_MESSAGE.SIGN_UP)
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(AUTH_MESSAGE.SIGN_IN)
  async signIn(@Req() req: { user: User }) {
    return await this.authService.signIn(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(AUTH_MESSAGE.REFRESH_TOKEN)
  async refresh(@Req() req: { user: User; refreshToken: string }) {
    const { refreshToken } = req;
    return await this.authService.refresh(refreshToken);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(AUTH_MESSAGE.LOG_OUT)
  async logout(@Req() req: { user: User }) {
    return await this.authService.logout(req.user.id);
  }
}
