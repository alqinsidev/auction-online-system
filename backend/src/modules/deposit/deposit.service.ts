import { Injectable } from '@nestjs/common';
import { StoreDepositDTO } from './dto/store-deposit.dto';
import { AuthPayload } from '../../common/interface/auth/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { DataSource, Repository } from 'typeorm';
import { DepositHistory } from './entities/deposit-history.entity';
import { NotFoundError } from '../../utils/errorHandling.utils';
import { StoreDepositResponse } from 'src/common/interface/deposit/deposit.interface';

@Injectable()
export class DepositService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Deposit)
    private depositRepository: Repository<Deposit>,
    @InjectRepository(DepositHistory)
    private depositHistoryRepository: Repository<DepositHistory>,
  ) {}

  async storeDeposit(
    storeDepositDto: StoreDepositDTO,
    authPayload: AuthPayload,
  ): Promise<StoreDepositResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentDeposit = await queryRunner.manager.findOne(Deposit, {
        where: { user_id: authPayload.id },
      });
      currentDeposit.amount =
        currentDeposit.amount + storeDepositDto.store_amount;

      const updatedDeposit = await queryRunner.manager.save(currentDeposit);

      const historyData = {
        user_id: authPayload.id,
        amount: storeDepositDto.store_amount,
      };
      await queryRunner.manager.save(DepositHistory, historyData);
      await queryRunner.commitTransaction();
      const responseData = {
        id: updatedDeposit.id,
        updated_at: updatedDeposit.updated_at,
        updated_deposit: updatedDeposit.amount,
        store_amount: storeDepositDto.store_amount,
      };
      return responseData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMyDeposit(authPayload: AuthPayload): Promise<Deposit> {
    try {
      const myDeposit = await this.depositRepository.findOne({
        where: { user_id: authPayload.id },
      });
      if (!myDeposit) {
        throw new NotFoundError('id not found');
      }
      return myDeposit;
    } catch (error) {
      throw error;
    }
  }

  async getMyDepositHistory(
    authPayload: AuthPayload,
  ): Promise<DepositHistory[]> {
    try {
      const myDepositHistory = await this.depositHistoryRepository.find({
        where: {
          user_id: authPayload.id,
        },
        order: {
          created_at: 'DESC',
        },
      });
      return myDepositHistory;
    } catch (error) {
      throw error;
    }
  }
}
