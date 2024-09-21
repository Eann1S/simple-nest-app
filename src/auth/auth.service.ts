import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrpyt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { saltRounds } from './constants';
import { RegisterDto, SignInDto, JwtDto } from './dtos';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const hashedPassword = await this.hashPassword(registerDto);
    this.userService.createUser({ ...registerDto, password: hashedPassword });
  }

  async signIn(signInDto: SignInDto): Promise<JwtDto> {
    const { email, password } = signInDto;
    const user = await this.userService.getUser({ email });
    await this.validatePassword(password, user);
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }

  private hashPassword(registerDto: RegisterDto) {
    return bcrpyt.hash(registerDto.password, saltRounds);
  }

  private async validatePassword(password: string, user: User) {
    const isPasswordValid = await bcrpyt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
  }
}
