import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Auth API', () => {
  beforeAll(async () => {
    // Clean up DB
    await prisma.completion.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
