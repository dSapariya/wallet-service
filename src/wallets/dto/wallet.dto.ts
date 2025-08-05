import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SetupWalletDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  balance: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
