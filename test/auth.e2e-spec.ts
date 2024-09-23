import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { RegisterDto } from '../src/auth/auth.dtos';
import { generateRandomUserData, registerUser } from './test.constants';
import { AppModule } from '../src/app.module';

describe('Auth Module (e2e)', () => {
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
    const res = await prismaService.user.deleteMany();
    console.log('before each:', res);
  });

  describe('POST /auth/register', () => {
    userData = generateRandomUserData();

    it('should register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      userData = generateRandomUserData();
      await registerUser(app, userData);
    });

    it('should login and return JWT', () => {
      const loginDto = { email: userData.email, password: userData.password };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('access_token');
        });
    });

    it('should return 401 when password is incorrect', () => {
      const loginDto = { email: userData.email, password: 'invalid' };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('Unauthorized');
        });
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
