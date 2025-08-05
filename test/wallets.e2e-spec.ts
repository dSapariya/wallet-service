import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Wallets E2E', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/setup (POST) - should create a wallet', async () => {
    const res = await request(app.getHttpServer())
      .post('/setup')
      .send({ name: 'E2E Wallet', balance: '50.00' })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('E2E Wallet');
    expect(res.body.balance).toBe(50);
    walletId = res.body.id;
  });

  it('/wallet/:id (GET) - should get wallet details', async () => {
    const res = await request(app.getHttpServer())
      .get(`/wallet/${walletId}`)
      .expect(200);
    expect(res.body).toHaveProperty('id', walletId);
    expect(res.body).toHaveProperty('name', 'E2E Wallet');
    expect(res.body).toHaveProperty('balance', 50);
  });
});
