import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  generateRandomUserData,
  loginUser,
  registerUser,
} from './test.constants';
import { RegisterDto } from '../src/auth/auth.dtos';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let userData: RegisterDto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    userData = generateRandomUserData();
  });

  describe('GET /profile', () => {
    it('should return profile when provided valid JWT', async () => {
      await registerUser(app, userData);
      const jwtDto = await loginUser(app, userData);
      const accessToken = jwtDto.access_token;
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  afterEach(async () => {
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.$disconnect();
    await app.close();
  });
});
