import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { SetupWalletDto } from './dto/wallet.dto';

describe('WalletsController', () => {
  let controller: WalletsController;
  let service: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: {
            setupWallet: jest.fn(),
            getWallet: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    service = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call setupWallet and return the result', async () => {
    const setupWalletDto: SetupWalletDto = {
      name: 'Test Wallet',
      balance: 100.0,
    };
    const result = {
      id: 'wallet1',
      name: 'Test Wallet',
      balance: 100,
      transactionId: 'trans1',
      date: new Date(),
    };
    jest.spyOn(service, 'setupWallet').mockResolvedValue(result);

    expect(await controller.setupWallet(setupWalletDto)).toBe(result);
    expect(service.setupWallet).toHaveBeenCalledWith(setupWalletDto);
  });

  it('should call getWallet and return the result', async () => {
    const walletId = 'wallet123';
    const result = {
      id: walletId,
      name: 'Test Wallet',
      balance: 100,
      date: new Date(),
    };
    jest.spyOn(service, 'getWallet').mockResolvedValue(result);

    expect(await controller.getWallet(walletId)).toBe(result);
    expect(service.getWallet).toHaveBeenCalledWith(walletId);
  });
});
