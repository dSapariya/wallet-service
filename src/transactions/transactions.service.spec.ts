import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockPrismaService = {
  wallet: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn((cb) => cb(mockPrismaService)),
};

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction and update wallet', async () => {
    const wallet = { id: '1', balance: 100 };
    const updatedWallet = { id: '1', balance: 150 };
    const transaction = { id: 't1', walletId: '1', amount: 50, balance: 150, description: 'Test', type: 'CREDIT', createdAt: new Date() };
    mockPrismaService.wallet.findUnique.mockResolvedValue(wallet);
    mockPrismaService.wallet.update.mockResolvedValue(updatedWallet);
    mockPrismaService.transaction.create.mockResolvedValue(transaction);
    const dto = { amount: 50, description: 'Test' };
    const result = await service.createTransaction('1', dto);
    expect(result.balance).toBe(150);
    expect(result.transactionId).toBe('t1');
  });

  it('should throw NotFoundException if wallet not found', async () => {
    mockPrismaService.wallet.findUnique.mockResolvedValue(null);
    const dto = { amount: 50, description: 'Test' };
    await expect(service.createTransaction('notfound', dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if insufficient balance', async () => {
    const wallet = { id: '1', balance: 10 };
    mockPrismaService.wallet.findUnique.mockResolvedValue(wallet);
    const dto = { amount: -20, description: 'Test' };
    await expect(service.createTransaction('1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should get paginated transactions and total count', async () => {
    mockPrismaService.wallet.findUnique.mockResolvedValue({ id: '1', balance: 100 });
    mockPrismaService.transaction.count.mockResolvedValue(2);
    mockPrismaService.transaction.findMany.mockResolvedValue([
      { id: 't1', walletId: '1', amount: 10, balance: 110, description: 'A', createdAt: new Date(), type: 'CREDIT' },
      { id: 't2', walletId: '1', amount: -5, balance: 105, description: 'B', createdAt: new Date(), type: 'DEBIT' },
    ]);
    const result = await service.getTransactions({ walletId: '1', skip: 0, limit: 2, sortBy: 'date', order: 'desc' });
    expect(result.total).toBe(2);
    expect(result.transactions.length).toBe(2);
  });
}); 