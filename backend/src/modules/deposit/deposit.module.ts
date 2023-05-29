import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { DepositHistory } from './entities/deposit-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit, DepositHistory])],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
