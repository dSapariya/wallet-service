import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SetupWalletDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Initial balance cannot be negative.' })
  @Transform(({ value }) => parseFloat(value))
  balance: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
