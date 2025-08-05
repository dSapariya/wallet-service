import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Transactions E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let walletId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    // Clear the database before tests
    await prisma.transaction.deleteMany({});
    await prisma.wallet.deleteMany({});

    // Create a wallet for transaction tests
    const walletRes = await request(app.getHttpServer())
      .post('/setup')
      .send({ name: 'E2E Transaction Wallet', balance: '100.00' });
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
  });

  it('/transactions (GET) - should get wallet transactions with total count', async () => {
    const res = await request(app.getHttpServer())
      .get(`/transactions?walletId=${walletId}&skip=0&limit=10`)
      .expect(200);
    expect(res.body.transactions.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('total');
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('/transactions (GET) - should get all wallet transactions when exportAll is true', async () => {
    // Create more transactions for the wallet to ensure total count is meaningful
    await request(app.getHttpServer())
      .post(`/transact/${walletId}`)
      .send({ amount: 10, description: 'Another transaction' })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/transact/${walletId}`)
      .send({ amount: 5, description: 'One more' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/transactions?walletId=${walletId}&exportAll=true`)
      .expect(200);

    expect(res.body).toHaveProperty('total');
    expect(res.body.transactions.length).toBe(res.body.total);
    expect(res.body.transactions.length).toBeGreaterThanOrEqual(3); // Initial + 2 new
  });

  it('/transactions (GET) - should sort transactions by amount in descending order', async () => {
    // Ensure some transactions exist with varying amounts
    await request(app.getHttpServer())
      .post(`/transact/${walletId}`)
      .send({ amount: 10, description: 'Amount test 1' });
    await request(app.getHttpServer())
      .post(`/transact/${walletId}`)
      .send({ amount: 30, description: 'Amount test 2' });
    await request(app.getHttpServer())
      .post(`/transact/${walletId}`)
      .send({ amount: 20, description: 'Amount test 3' });

    const res = await request(app.getHttpServer())
      .get(`/transactions?walletId=${walletId}&sortBy=amount&order=desc`)
      .expect(200);

    expect(res.body.transactions.length).toBeGreaterThan(0);
    const amounts = res.body.transactions.map((t) => t.amount);
    for (let i = 0; i < amounts.length - 1; i++) {
      expect(amounts[i]).toBeGreaterThanOrEqual(amounts[i + 1]);
    }
  });
});
