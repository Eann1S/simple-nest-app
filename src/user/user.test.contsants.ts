import { User } from '@prisma/client';
import { randomInt } from 'crypto';

export const testUser: User = {
  id: randomInt(10),
  email: 'test@email.com',
  name: 'test@email.com',
  password: 'test@email.com',
};
