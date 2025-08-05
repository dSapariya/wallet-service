import {
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsIn,
  NotEquals,
  IsInt
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @IsNumber()
  @Min(-999999.9999)
  @Max(999999.9999)
  @NotEquals(0, { message: 'Transaction amount cannot be zero.' })
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
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => (value === null || value === undefined || value === '' ? undefined : parseInt(value)))
  skip?: number = 0;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value === null || value === undefined || value === '' ? undefined : parseInt(value)))
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
