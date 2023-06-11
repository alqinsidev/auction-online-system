import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { StoreDepositDTO } from './dto/store-deposit.dto';
import { AuthPayload } from '../../common/interface/auth/auth.interface';
import { DataSource, Repository, SelectQueryBuilder, Timestamp } from 'typeorm';
import { Deposit } from './entities/deposit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResponseMessage } from 'src/common/interface/response/response.interface';
import { DepositHistory } from './entities/deposit-history.entity';
import HandleErrorException from '../../utils/errorHandling.utils';
import * as Sentry from '@sentry/node';

describe('DepositService', () => {
  let depositService: DepositService;
  let dataSource: DataSource;
  let depositRepository: Repository<Deposit>;
  let depositHistoryRepository: Repository<DepositHistory>;
  const authPayload: AuthPayload = {
    id: '1',
    fullname: 'test',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DepositService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Deposit),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DepositHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    depositService = moduleRef.get<DepositService>(DepositService);
    dataSource = moduleRef.get<DataSource>(DataSource);
    depositRepository = moduleRef.get<Repository<Deposit>>(
      getRepositoryToken(Deposit),
    );
    depositHistoryRepository = moduleRef.get<Repository<DepositHistory>>(
      getRepositoryToken(DepositHistory),
    );
  });

  describe('storeDeposit', () => {
    it('should throw an error and handle it correctly', async () => {
      // Create mock objects and functions
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        manager: {
          findOne: jest.fn().mockRejectedValue(new Error('Test error')),
          save: jest.fn(),
        },
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      };

      dataSource.createQueryRunner = jest.fn().mockReturnValue(mockQueryRunner);

      const storeDepositDto = {
        store_amount: 50,
      };

      await expect(
        depositService.storeDeposit(storeDepositDto, authPayload),
      ).rejects.toThrow(Error);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('getMyDeposit', () => {
    it('should return the deposit for the authenticated user', async () => {
      const myDeposit = new Deposit();
      myDeposit.user_id = '1';
      myDeposit.amount = 200;

      jest.spyOn(depositRepository, 'findOne').mockResolvedValue(myDeposit);

      // Act
      const result = await depositService.getMyDeposit(authPayload);

      expect(result).toEqual(myDeposit);
    });
  });

  describe('getDepositHistory', () => {
    it('should return all of my deposit history', async () => {
      const myDeposit = new DepositHistory();
      myDeposit.amount = 100000;
      myDeposit.created_at = new Date().toISOString() as unknown as Timestamp;
      myDeposit.isReturn = false;

      jest
        .spyOn(depositHistoryRepository, 'find')
        .mockResolvedValue([myDeposit]);
      const result = await depositService.getMyDepositHistory(authPayload);
      expect(result).toEqual([myDeposit]);
    });
  });
});
