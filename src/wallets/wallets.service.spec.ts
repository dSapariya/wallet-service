import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  wallet: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
  },
  $transaction: jest.fn((cb) => cb(mockPrismaService)),
};

describe('WalletsService', () => {
  let service: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<WalletsService>(WalletsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a wallet and initial transaction', async () => {
    const dto = { balance: 100.00, name: 'Test Wallet' };
    const wallet = { id: '1', name: 'Test Wallet', balance: 100, createdAt: new Date() };
    const transaction = { id: 't1', walletId: '1', amount: 100, balance: 100, description: 'Initial wallet setup', type: 'CREDIT', createdAt: new Date() };
    mockPrismaService.wallet.create.mockResolvedValue(wallet);
    mockPrismaService.transaction.create.mockResolvedValue(transaction);
    const result = await service.setupWallet(dto);
    expect(result.name).toBe('Test Wallet');
    expect(result.balance).toBe(100);
    expect(result.transactionId).toBe('t1');
  });

  it('should get a wallet by id', async () => {
    const wallet = { id: '1', name: 'Test Wallet', balance: 100, createdAt: new Date() };
    mockPrismaService.wallet.findUnique.mockResolvedValue(wallet);
    const result = await service.getWallet('1');
    expect(result.id).toBe('1');
    expect(result.name).toBe('Test Wallet');
  });

  it('should throw NotFoundException if wallet not found', async () => {
    mockPrismaService.wallet.findUnique.mockResolvedValue(null);
    await expect(service.getWallet('notfound')).rejects.toThrow(NotFoundException);
  });
}); 