import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetupWalletDto } from './dto/wallet.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async setupWallet(setupWalletDto: SetupWalletDto) {
    const { balance, name } = setupWalletDto;

    // Create wallet and initial transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const wallet = await prisma.wallet.create({
        data: {
          name,
          balance: new Decimal(balance),
        },
      });

      // Create the initial credit transaction for the wallet
      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: new Decimal(balance),
          balance: new Decimal(balance),
          description: 'Initial wallet setup',
          type: 'CREDIT',
        },
      });

      return { wallet, transaction };
    });

    return {
      id: result.wallet.id,
      balance: parseFloat(result.wallet.balance.toString()),
      transactionId: result.transaction.id,
      name: result.wallet.name,
      date: result.wallet.createdAt,
    };
  }

  async getWallet(id: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    return {
      id: wallet.id,
      balance: parseFloat(wallet.balance.toString()),
      name: wallet.name,
      date: wallet.createdAt,
    };
  }

  async getAllWallets() {
    const wallets = await this.prisma.wallet.findMany({
      select: {
        id: true,
        name: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return wallets.map((wallet) => ({
      ...wallet,
      balance: parseFloat(wallet.balance.toString()),
    }));
  }

  async updateWalletBalance(id: string, newBalance: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    return this.prisma.wallet.update({
      where: { id },
      data: { balance: new Decimal(newBalance) },
    });
  }
}
