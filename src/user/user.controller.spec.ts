import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMock } from '@golevelup/ts-jest';
import { Prisma, User } from '@prisma/client';
import { testUser } from './user.test.contsants';

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
    service.getUser = jest.fn().mockResolvedValue(testUser);

    expect(await controller.getUser('1')).toBe(testUser);
  });

  it('should return users', async () => {
    const users: User[] = [
      { ...testUser, id: 1 },
      { ...testUser, id: 2 },
    ];
    service.getUsers = jest.fn().mockResolvedValue(users);

    expect(await controller.getUsers()).toBe(users);
  });

  it('should update user', async () => {
    const data: Prisma.UserUpdateInput = {
      email: 'test',
      name: 'test',
      password: '123',
    };
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
