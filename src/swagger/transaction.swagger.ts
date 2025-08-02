import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateTransactionDtoSchema } from './schemas.swagger';

export const ApiCreateTransaction = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Perform credit/debit transaction on a wallet',
      description: 'Performs a credit (positive amount) or debit (negative amount) transaction on the specified wallet. The amount can have up to 4 decimal places of precision.'
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
          error: 'Not Found'
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Insufficient balance or invalid amount',
      schema: {
        example: {
          statusCode: 400,
          message: 'Insufficient balance for this transaction',
          error: 'Bad Request'
        }
      }
    })
  );

export const ApiGetTransactions = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Get paginated list of transactions for a wallet',
      description: 'Retrieves a paginated list of transactions for the specified wallet, ordered by most recent first.'
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
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of transactions for the wallet',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '343434' },
            walletId: { type: 'string', example: '2434343' },
            amount: { type: 'number', example: 2.4 },
            balance: { type: 'number', example: 12.4 },
            description: { type: 'string', example: 'Recharge' },
            date: { type: 'string', format: 'date-time', example: '2025-08-02T00:00:00.000Z' },
            type: { type: 'string', enum: ['CREDIT', 'DEBIT'], example: 'CREDIT' },
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
          error: 'Not Found'
        }
      }
    })
  );

export const ApiGetAllTransactions = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Get all transactions',
      description: 'Retrieves a paginated list of all transactions in the system, ordered by most recent first.'
    }),
    ApiQuery({
      name: 'skip',
      description: 'Number of records to skip (for pagination)',
      required: false,
      example: 0,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Maximum number of records to fetch (max 100)',
      required: false,
      example: 10,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of all transactions',
      schema: {
        example: [
          {
            id: 'clx9876543210fedcba',
            walletId: 'clx1234567890abcdef',
            amount: 25.7500,
            balance: 126.2500,
            description: 'Recharge',
            date: '2025-08-02T10:30:00.000Z',
            type: 'CREDIT',
            wallet: {
              id: 'clx1234567890abcdef',
              name: 'My Wallet',
            },
          },
        ],
      },
    })
  );

export const ApiGetTransactionById = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Get transaction by ID',
      description: 'Retrieves a specific transaction by its ID, including wallet information.'
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the transaction to retrieve',
      example: 'clx9876543210fedcba',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Transaction details retrieved successfully',
      schema: {
        example: {
          id: 'clx9876543210fedcba',
          walletId: 'clx1234567890abcdef',
          amount: 25.7500,
          balance: 126.2500,
          description: 'Recharge',
          date: '2025-08-02T10:30:00.000Z',
          type: 'CREDIT',
          wallet: {
            id: 'clx1234567890abcdef',
            name: 'My Wallet',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Transaction not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Transaction with ID clx9876543210fedcba not found',
          error: 'Not Found'
        }
      }
    })
  ); 