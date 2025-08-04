import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Transactions E2E', () => {
  let app: INestApplication;
  let walletId: string;
  let transactionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    const walletRes = await request(app.getHttpServer())
      .post('/setup')
      .send({ name: 'E2E Transaction Wallet', balance: 100.00 });
    walletId = walletRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transact/:walletId (POST) - should create a transaction', async () => {
    const res = await request(app.getHttpServer())
      .post(`/transact/${walletId}`)
      .send({ amount: 25, description: 'E2E Test Transaction' })
      .expect(201);
    expect(res.body).toHaveProperty('balance');
    expect(res.body).toHaveProperty('transactionId');
    transactionId = res.body.transactionId;
  });

  it('/transactions (GET) - should get wallet transactions', async () => {
    const res = await request(app.getHttpServer())
      .get(`/transactions?walletId=${walletId}&skip=0&limit=10`)
      .expect(200);
    expect(res.body.transactions.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('total');
  });

  it('/transaction/:id (GET) - should get transaction by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/transaction/${transactionId}`)
      .expect(200);
    expect(res.body).toHaveProperty('id', transactionId);
    expect(res.body).toHaveProperty('walletId', walletId);
  });
}); 