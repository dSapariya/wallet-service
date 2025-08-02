import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SetupWalletDto {
  @IsString()
  @IsNotEmpty()
  balance: string;

  @IsString()
  @IsNotEmpty()
  name: string;
} 