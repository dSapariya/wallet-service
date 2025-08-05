import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { TransactionsQueryDto } from './dto/transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    walletId: string,
    transactionDto: CreateTransactionDto,
  ) {
    const { amount, description } = transactionDto;

    const result = await this.prisma.$transaction(async (prisma) => {
      // Get current wallet balance
      const wallet = await prisma.wallet.findUnique({
        where: { id: walletId },
        select: { id: true, balance: true },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${walletId} not found`);
      }

      const currentBalance = parseFloat(wallet.balance.toString());
      const newBalance = currentBalance + amount;

      // Check for negative balance
      if (newBalance < 0) {
        throw new BadRequestException(
          'Insufficient balance for this transaction',
        );
      }

      // Update wallet balance with new balance
      const updatedWallet = await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: new Decimal(newBalance) },
      });

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          walletId,
          amount: new Decimal(amount),
          balance: new Decimal(newBalance),
          description,
          type: amount >= 0 ? 'CREDIT' : 'DEBIT',
        },
      });

      return { wallet: updatedWallet, transaction };
    });

    return {
      balance: parseFloat(result.wallet.balance.toString()),
      transactionId: result.transaction.id,
    };
  }

  async getTransactions(query: TransactionsQueryDto) {
    const { walletId, skip, limit, sortBy, order, exportAll } = query;

    // check if wallet exists
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${walletId} not found`);
    }

    let orderBy: any = { createdAt: 'desc' };

    switch (sortBy) {
      case 'amount':
        orderBy = { amount: order };
        break;
      case 'date':
        orderBy = { createdAt: order };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get total count for pagination
    const total = await this.prisma.transaction.count({ where: { walletId } });

    // Get transactions with pagination and sorting
    const transactions = await this.prisma.transaction.findMany({
      where: { walletId },
      orderBy,
      skip: exportAll ? undefined : skip || 0,
      take: exportAll ? undefined : limit || 10,
    });

    return {
      total,
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        walletId: transaction.walletId,
        amount: parseFloat(transaction.amount.toString()),
        balance: parseFloat(transaction.balance.toString()),
        description: transaction.description,
        date: transaction.createdAt,
        type: transaction.type,
      })),
    };
  }
}
