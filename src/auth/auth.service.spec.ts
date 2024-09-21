import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtDto, RegisterDto, SignInDto } from './dtos';
import { createMock } from '@golevelup/ts-jest';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const testUser: User = {
  id: 1,
  email: 'test@email.com',
  name: 'test',
  password: bcrypt.hashSync('12345', bcrypt.genSaltSync()),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should register', async () => {
    const registerDto: RegisterDto = { ...testUser };
    userService.createUser = jest.fn();

    await authService.register(registerDto);

    expect(userService.createUser).toHaveBeenCalledWith({
      ...registerDto,
      password: expect.any(String),
    });
  });

  it('should signIn when password is valid', async () => {
    const signInDto: SignInDto = { ...testUser, password: '12345' };
    userService.getUser = jest.fn().mockResolvedValue(testUser);
    jwtService.signAsync = jest.fn().mockResolvedValue('token');

    const actual: JwtDto = await authService.signIn(signInDto);

    expect(userService.getUser).toHaveBeenCalledWith({ email: testUser.email });
    expect(actual).toHaveProperty('access_token', 'token');
  });

  it("shouldn't signIn when password is invalid", async () => {
    const signInDto: SignInDto = { ...testUser, password: 'invalid' };
    userService.getUser = jest.fn().mockResolvedValue(testUser);

    await expect(() => authService.signIn(signInDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
