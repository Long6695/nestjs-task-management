import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { Auth } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(
      user,
      +`${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(
      user,
      +`${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`,
    );
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const { user, token } =
      await this.createAccessTokenFromRefreshToken(refreshToken);

    return {
      user,
      accessToken: token,
    };
  }

  async logout(userId: number) {
    return this.authRepository.update({ userId }, { isRevoked: true });
  }
  async validateUser(signInDto: SignInDto) {
    const foundUser = await this.usersService.findByEmail(signInDto.email);

    if (foundUser && (await compare(signInDto.password, foundUser.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return foundUser;
    }

    throw new UnauthorizedException();
  }

  generateAccessToken(user: User) {
    return this.jwtService.signAsync(
      { user },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}s`,
      },
    );
  }

  async generateRefreshToken(user: User, expiresIn: number) {
    await this.saveRefreshToken(user, expiresIn);
    return this.jwtService.signAsync(
      { user },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${expiresIn}s`,
      },
    );
  }

  public async saveRefreshToken(user: User, ttl: number): Promise<Auth> {
    const expiration = new Date();

    expiration.setTime(expiration.getTime() + ttl);

    const foundToken = await this.authRepository.findOne({
      where: {
        userId: user.id,
      },
    });
    if (foundToken) {
      return this.authRepository.save({
        id: foundToken.id,
        userId: user.id,
        isRevoked: false,
        expires: expiration,
      });
    }

    return this.authRepository.save({
      userId: user.id,
      isRevoked: false,
      expires: expiration,
    });
  }

  public async findTokenByUserId(userId: number): Promise<Auth | null> {
    return this.authRepository.findOne({
      where: {
        userId,
      },
    });
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: User; token: Auth }> {
    const payload = await this.decodeRefreshToken(encoded);

    const token = await this.getStoredTokenFromRefreshTokenPayload(
      payload.user.id,
    );

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload.user);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token };
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: User }> {
    const { user } = await this.resolveRefreshToken(refresh);
    const token = await this.generateAccessToken(user);
    return { user, token };
  }

  private async decodeRefreshToken(token: string): Promise<{ user: User }> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: 'refresh_token_secret',
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  public async getUserFromRefreshTokenPayload(payload: User): Promise<User> {
    if (!payload) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.usersService.findByEmail(payload.email);
  }

  public async getStoredTokenFromRefreshTokenPayload(
    userId: number,
  ): Promise<Auth | null> {
    if (!userId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.findTokenByUserId(userId);
  }
}
