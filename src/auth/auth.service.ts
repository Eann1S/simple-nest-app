import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrpyt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { saltRounds } from './auth.constants';
import { RegisterDto, JwtDto } from './auth.dtos';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateCredentials(email: string, password: string) {
    const user = await this.userService.getUser({ email });
    const isPasswordValid = await bcrpyt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const { password: _, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const hashedPassword = await this.hashPassword(registerDto.password);
    this.userService.createUser({ ...registerDto, password: hashedPassword });
  }

  async login(user): Promise<JwtDto> {
    const payload = { sub: user.id, ...user };
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }

  private hashPassword(password: string) {
    return bcrpyt.hash(password, saltRounds);
  }
}
