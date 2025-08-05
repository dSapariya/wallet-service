import {
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @IsNumber()
  @Min(-999999.9999)
  @Max(999999.9999)
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class TransactionsQueryDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value) || 0)
  skip?: number = 0;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value) || 10)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['amount', 'date'])
  sortBy?: string = 'date';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: string = 'desc';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Transform string 'true' to boolean true
  exportAll?: boolean = false;
}
