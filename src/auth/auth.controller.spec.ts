import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from './auth.service';
import { RegisterDto, JwtDto } from './auth.dtos';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register', async () => {
    const registerDto: RegisterDto = {
      email: 'test',
      name: 'test',
      password: '12345',
    };
    service.register = jest.fn();

    await controller.register(registerDto);

    expect(service.register).toHaveBeenCalledWith({ ...registerDto });
  });

  it('should login', async () => {
    const user = { email: 'test', password: '12345' };
    const jwtDto: JwtDto = { access_token: 'token' };
    service.login = jest.fn().mockResolvedValue(jwtDto);

    const res = await controller.login({ user });

    expect(service.login).toHaveBeenCalledWith(user);
    expect(res).toBe(jwtDto);
  });
});
