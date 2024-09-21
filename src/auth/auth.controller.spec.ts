import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from './auth.service';
import { RegisterDto, SignInDto } from './dtos';

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

  it('should sign in', async () => {
    const signInDto: SignInDto = { email: 'test', password: '12345' };
    service.signIn = jest.fn().mockResolvedValue(true);

    const actual = await controller.signIn(signInDto);

    expect(actual).toBe(true);
  });
});
