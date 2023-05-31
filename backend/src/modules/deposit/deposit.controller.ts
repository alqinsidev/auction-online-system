import {
  Controller,
  Body,
  Put,
  UseGuards,
  Request,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { StoreDepositDTO } from './dto/store-deposit.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { AuthPayload } from 'src/common/interface/auth/auth.interface';
import { ResponseFormat } from 'src/utils/response.utils';
import HandleErrorException from 'src/utils/errorHandling.utils';

@Controller('deposit')
@UseGuards(JwtAuthGuard)
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Put('')
  async updateDeposit(
    @Request() req: any,
    @Body() storeDepositDto: StoreDepositDTO,
  ) {
    try {
      const authPayload: AuthPayload = req.user;
      const data = await this.depositService.storeDeposit(
        storeDepositDto,
        authPayload,
      );
      return ResponseFormat(data, HttpStatus.OK, 'successfully store deposit');
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  @Get('')
  async getMyDeposit(@Request() req: any) {
    try {
      const authPayload: AuthPayload = req.user;
      const data = await this.depositService.getMyDeposit(authPayload);
      return ResponseFormat(data);
    } catch (error) {
      throw HandleErrorException(error);
    }
  }
}
