import { Controller, Body, Put, UseGuards, Request, Get } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { StoreDepositDTO } from './dto/store-deposit.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { AuthPayload } from 'src/common/interface/auth/auth.interface';

@Controller('deposit')
@UseGuards(JwtAuthGuard)
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Put('')
  updateDeposit(@Request() req: any, @Body() storeDepositDto: StoreDepositDTO) {
    const authPayload: AuthPayload = req.user;
    return this.depositService.storeDeposit(storeDepositDto, authPayload);
  }

  @Get('')
  getMyDeposit(@Request() req: any) {
    const authPayload: AuthPayload = req.user;
    return this.depositService.getMyDeposit(authPayload);
  }
}
