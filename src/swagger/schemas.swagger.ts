import { ApiProperty } from '@nestjs/swagger';

// Transaction DTOs
export class CreateTransactionDtoSchema {
  @ApiProperty({ 
    example: 10.3456, 
    description: 'Transaction amount (positive for credit, negative for debit, up to 4 decimal places)' 
  })
  amount: number;

  @ApiProperty({ 
    example: 'Recharge', 
    description: 'Transaction description' 
  })
  description: string;
}

export class TransactionsQueryDtoSchema {
  @ApiProperty({ 
    example: 'clx1234567890abcdef', 
    description: 'Wallet ID' 
  })
  walletId: string;

  @ApiProperty({ 
    example: 10, 
    description: 'Number of records to skip',
    required: false,
    default: 0
  })
  skip?: number = 0;

  @ApiProperty({ 
    example: 25, 
    description: 'Maximum number of records to fetch',
    required: false,
    default: 10
  })
  limit?: number = 10;
}

// Wallet DTOs
export class CreateWalletDtoSchema {
  @ApiProperty({ 
    example: 'Hello world', 
    description: 'Wallet name' 
  })
  name: string;
}

export class SetupWalletDtoSchema {
  @ApiProperty({ 
    example: 20.5612, 
    description: 'Initial wallet balance (up to 4 decimal places)' 
  })
  balance: string;

  @ApiProperty({ 
    example: 'Hello world', 
    description: 'Wallet name' 
  })
  name: string;
} 