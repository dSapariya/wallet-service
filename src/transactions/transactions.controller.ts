import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  TransactionsQueryDto,
} from './dto/transaction.dto';
import {
  ApiCreateTransaction,
  ApiGetTransactions,
} from '../swagger/transaction.swagger';

@ApiTags('Transactions')
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transact/:walletId')
  @ApiCreateTransaction()
  async createTransaction(
    @Param('walletId') walletId: string,
    @Body() transactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(walletId, transactionDto);
  }

  @Get('transactions')
  @ApiGetTransactions()
  async getTransactions(@Query() query: TransactionsQueryDto) {
    return this.transactionsService.getTransactions(query);
  }
}
