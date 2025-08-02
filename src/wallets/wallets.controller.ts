import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { SetupWalletDto } from './dto/wallet.dto';
import { ApiSetupWallet, ApiGetWallet } from '../swagger/wallet.swagger';

@ApiTags('Wallets')
@Controller()
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post('setup')
  @ApiSetupWallet()
  async setupWallet(@Body() setupWalletDto: SetupWalletDto) {
    return this.walletsService.setupWallet(setupWalletDto);
  }

  @Get('wallet/:id')
  @ApiGetWallet()
  async getWallet(@Param('id') id: string) {
    return this.walletsService.getWallet(id);
  }
} 