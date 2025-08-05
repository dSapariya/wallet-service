import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SetupWalletDtoSchema } from './schemas.swagger';

export const ApiSetupWallet = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Setup a new wallet with initial balance',
      description:
        'Creates a new wallet with the specified name and initial balance. The balance can have up to 4 decimal places of precision.',
    }),
    ApiBody({ type: SetupWalletDtoSchema }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Wallet created successfully with initial transaction',
      schema: {
        example: {
          id: 'wallet_id_generated',
          balance: 20.5612,
          transactionId: '4349349843',
          name: 'Hello world',
          date: '2025-08-02T00:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input data - balance must be positive and name is required',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'balance must be a positive number',
            'name should not be empty',
          ],
          error: 'Bad Request',
        },
      },
    }),
  );

export const ApiGetWallet = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get wallet details by ID',
      description:
        'Retrieves the wallet information including current balance, name, and creation date.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID of the wallet to retrieve',
      example: '1243434',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Wallet details retrieved successfully',
      schema: {
        example: {
          id: '1243434',
          balance: 12.4,
          name: 'Wallet A',
          date: '2025-08-02T00:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Wallet not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Wallet with ID 1243434 not found',
          error: 'Not Found',
        },
      },
    }),
  );
