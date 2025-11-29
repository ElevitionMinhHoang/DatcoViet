import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: uniqueEmail,
        password: 'password123',
        name: 'Test User',
        phone: '0123456789'
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/auth/login (POST)', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          name: 'Test User',
          phone: '0123456789'
        });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, password: 'password123' })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });
});
