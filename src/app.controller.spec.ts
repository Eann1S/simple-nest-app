import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return user from request', async () => {
      const user = { userId: '1', email: 'test' };

      const res = await appController.getProfile({ user });

      expect(res).toBe(user);
    });
  });
});
