import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtDto, RegisterDto } from './auth.dtos';
import { createMock } from '@golevelup/ts-jest';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

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

  it('should return user when credentials are valid', async () => {
    userService.getUser = jest.fn().mockResolvedValue(testUser);

    const res = await authService.validateCredentials(testUser.email, '12345');

    expect(userService.getUser).toHaveBeenCalledWith({ email: testUser.email });
    const { password: _, ...expectedRes } = testUser;
    expect(res).toEqual(expectedRes);
  });

  it('should throw exception when credentials are invalid', async () => {
    userService.getUser = jest.fn().mockResolvedValue(testUser);

    expect(() =>
      authService.validateCredentials(testUser.email, 'invalid'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should login', async () => {
    jwtService.signAsync = jest.fn().mockResolvedValue('token');

    const res: JwtDto = await authService.login(testUser);

    expect(res).toHaveProperty('access_token', 'token');
  });
});
