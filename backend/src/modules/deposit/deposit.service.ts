import { HttpStatus, Injectable } from '@nestjs/common';
import { StoreDepositDTO } from './dto/store-deposit.dto';
import { AuthPayload } from '../../common/interface/auth/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { DataSource, Repository } from 'typeorm';
import { DepositHistory } from './entities/deposit-history.entity';
import HandleErrorException from '../../utils/errorHandler';
import { ResponseMessage } from '../../common/interface/response/response.interface';

@Injectable()
export class DepositService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Deposit)
    private depositRepository: Repository<Deposit>,
  ) {}

  async storeDeposit(
    storeDepositDto: StoreDepositDTO,
    authPayload: AuthPayload,
  ): Promise<ResponseMessage<any>> {
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
      return {
        data: responseData,
        message: 'successfully store deposit',
        status: HttpStatus.OK,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw HandleErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getMyDeposit(authPayload: AuthPayload): Promise<ResponseMessage<any>> {
    try {
      const myDeposit = await this.depositRepository.findOne({
        where: { user_id: authPayload.id },
      });

      return {
        status: HttpStatus.OK,
        data: myDeposit,
      };
    } catch (error) {
      throw HandleErrorException(error);
    }
  }
}
