import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { createMock } from '@golevelup/ts-jest';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService],
    })
      .useMocker(createMock())
      .compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user', async () => {
    const user: User = { id: 1, email: 'test', name: 'test' };
    prisma.user.findUnique = jest.fn().mockResolvedValue(user);

    expect(await service.getUser({ id: 1 })).toBe(user);
  });

  it('should return all users', async () => {
    const users: User[] = [
      { id: 1, email: 'test1', name: 'test1' },
      { id: 2, email: 'test2', name: 'test2' },
    ];
    prisma.user.findMany = jest.fn().mockResolvedValue(users);

    expect(await service.getUsers({})).toBe(users);
  });

  it('should create user', async () => {
    const data: Prisma.UserCreateInput = {
      email: 'test',
      name: 'test',
    };
    prisma.user.create = jest.fn();

    await service.createUser(data);

    expect(prisma.user.create).toHaveBeenCalledWith({ data });
  });

  it('should update user', async () => {
    const data: Prisma.UserUpdateInput = {
      email: 'test',
      name: 'test',
    };
    const where: Prisma.UserWhereUniqueInput = { id: 1 };
    prisma.user.update = jest.fn();

    await service.updateUser({ where, data });

    expect(prisma.user.update).toHaveBeenCalledWith({ where, data });
  });

  it('should delete user', async () => {
    const where: Prisma.UserWhereUniqueInput = { id: 1 };
    prisma.user.delete = jest.fn();

    await service.deleteUser(where);

    expect(prisma.user.delete).toHaveBeenCalledWith({ where });
  });
});
