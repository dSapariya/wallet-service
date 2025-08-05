import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  TransactionsQueryDto,
} from './dto/transaction.dto';
import { TransactionType } from '@prisma/client'; // Import TransactionType enum

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            createTransaction: jest.fn(),
            getTransactions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createTransaction and return the result', async () => {
    const walletId = 'wallet123';
    const createTransactionDto: CreateTransactionDto = {
      amount: 50,
      description: 'Test Transaction',
    };
    const result = { balance: 150, transactionId: 'trans1' };
    jest.spyOn(service, 'createTransaction').mockResolvedValue(result);

    expect(
      await controller.createTransaction(walletId, createTransactionDto),
    ).toBe(result);
    expect(service.createTransaction).toHaveBeenCalledWith(
      walletId,
      createTransactionDto,
    );
  });

  it('should call getTransactions and return paginated result', async () => {
    const query: TransactionsQueryDto = {
      walletId: 'wallet123',
      skip: 0,
      limit: 10,
      sortBy: 'date',
      order: 'desc',
      exportAll: false,
    };
    const result = {
      total: 2,
      transactions: [
        {
          id: 't1',
          walletId: 'wallet123',
          amount: 10,
          balance: 110,
          description: 'A',
          date: new Date(),
          type: TransactionType.CREDIT,
        },
      ],
    };
    jest.spyOn(service, 'getTransactions').mockResolvedValue(result);

    expect(await controller.getTransactions(query)).toBe(result);
    expect(service.getTransactions).toHaveBeenCalledWith(query);
  });
});
