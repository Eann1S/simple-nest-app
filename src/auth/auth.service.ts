import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrpyt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { saltRounds } from './auth.constants';
import { RegisterDto, JwtDto, UserDto } from './auth.dtos';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateCredentials(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.getUser({ email });
    const isPasswordValid = await bcrpyt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const { password: _, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const hashedPassword = await this.hashPassword(registerDto.password);
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
    return user;
  }

  async login(user: UserDto): Promise<JwtDto> {
    const payload = { sub: user.id, ...user };
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }

  private hashPassword(password: string): Promise<string> {
    return bcrpyt.hash(password, saltRounds);
  }
}
