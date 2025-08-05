import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateTransactionDtoSchema } from './schemas.swagger';

export const ApiCreateTransaction = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Perform credit/debit transaction on a wallet',
      description:
        'Performs a credit (positive amount) or debit (negative amount) transaction on the specified wallet. The amount can have up to 4 decimal places of precision.',
    }),
    ApiParam({
      name: 'walletId',
      description: 'ID of the wallet to perform transaction on',
      example: 'clx1234567890abcdef',
    }),
    ApiBody({ type: CreateTransactionDtoSchema }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Transaction completed successfully',
      schema: {
        example: {
          balance: 30,
          transactionId: '83288323',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Wallet not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Wallet with ID clx1234567890abcdef not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Insufficient balance or invalid amount',
      schema: {
        example: {
          statusCode: 400,
          message: 'Insufficient balance for this transaction',
          error: 'Bad Request',
        },
      },
    }),
  );

export const ApiGetTransactions = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get paginated list of transactions for a wallet',
      description:
        'Retrieves a paginated list of transactions for the specified wallet with optional sorting by amount or date.',
    }),
    ApiQuery({
      name: 'walletId',
      description: 'ID of the wallet to get transactions for',
      example: '2434343',
    }),
    ApiQuery({
      name: 'skip',
      description: 'Number of records to skip (for pagination)',
      required: false,
      example: 10,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Maximum number of records to fetch (max 100)',
      required: false,
      example: 25,
    }),
    ApiQuery({
      name: 'sortBy',
      description: 'Field to sort by: amount or date (default: date)',
      required: false,
      example: 'amount',
      enum: ['amount', 'date'],
    }),
    ApiQuery({
      name: 'order',
      description: 'Sort order: asc or desc (default: desc)',
      required: false,
      example: 'desc',
      enum: ['asc', 'desc'],
    }),
    ApiQuery({
      name: 'exportAll',
      description:
        'If true, all transactions will be returned, ignoring skip and limit (default: false)',
      required: false,
      type: 'boolean',
      example: false,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of transactions for the wallet',
      schema: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 100 },
          transactions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '343434' },
                walletId: { type: 'string', example: '2434343' },
                amount: { type: 'number', example: 2.4 },
                balance: { type: 'number', example: 12.4 },
                description: { type: 'string', example: 'Recharge' },
                date: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-08-02T00:00:00.000Z',
                },
                type: {
                  type: 'string',
                  enum: ['CREDIT', 'DEBIT'],
                  example: 'CREDIT',
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Wallet not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Wallet with ID 2434343 not found',
          error: 'Not Found',
        },
      },
    }),
  );
