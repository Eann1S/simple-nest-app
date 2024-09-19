import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMock } from '@golevelup/ts-jest';
import { Prisma, User } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user', async () => {
    const user: User = { id: 1, email: 'test', name: 'test' };
    service.getUser = jest.fn().mockResolvedValue(user);

    expect(await controller.getUser('1')).toBe(user);
  });

  it('should return users', async () => {
    const users: User[] = [
      { id: 1, email: 'test1', name: 'test1' },
      { id: 2, email: 'test2', name: 'test2' },
    ];
    service.getUsers = jest.fn().mockResolvedValue(users);

    expect(await controller.getUsers()).toBe(users);
  });

  it('should create user', async () => {
    const data: Prisma.UserCreateInput = { email: 'test', name: 'test' };
    service.createUser = jest.fn();

    controller.createUser(data);

    expect(service.createUser).toHaveBeenCalledWith(data);
  });

  it('should update user', async () => {
    const data: Prisma.UserCreateInput = { email: 'test', name: 'test' };
    service.updateUser = jest.fn();

    controller.updateUser('1', data);

    expect(service.updateUser).toHaveBeenCalledWith({ where: { id: 1 }, data });
  });

  it('should delete user', async () => {
    service.deleteUser = jest.fn();

    controller.deleteUser('1');

    expect(service.deleteUser).toHaveBeenCalledWith({ id: 1 });
  });
});
