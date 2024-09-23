import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { RegisterDto } from '../src/auth/auth.dtos';

export const generateRandomUserData = () => {
  return {
    email: faker.internet.email(),
    name: faker.person.firstName(),
    password: faker.internet.password(),
  };
};

export const registerUser = async (
  app: INestApplication<any>,
  userData: RegisterDto,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/register')
    .send(userData);
  return response.body;
};

export const loginUser = async (
  app: INestApplication<any>,
  userData: { email: string; password: string },
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(userData);
  return response.body;
};
