import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { StoreDepositDTO } from './dto/store-deposit.dto';
import { AuthPayload } from '../../common/interface/auth/auth.interface';
import { DataSource, Repository, SelectQueryBuilder, Timestamp } from 'typeorm';
import { Deposit } from './entities/deposit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DepositService', () => {
  let depositService: DepositService;
  let dataSource: DataSource;
  let depositRepository: Repository<Deposit>;
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
      ],
    }).compile();

    depositService = moduleRef.get<DepositService>(DepositService);
    dataSource = moduleRef.get<DataSource>(DataSource);
    depositRepository = moduleRef.get<Repository<Deposit>>(
      getRepositoryToken(Deposit),
    );
  });

  describe('getMyDeposit', () => {
    it('should return the deposit for the authenticated user', async () => {
      const myDeposit = new Deposit();
      myDeposit.user_id = '1';
      myDeposit.amount = 200;

      jest.spyOn(depositRepository, 'findOne').mockResolvedValue(myDeposit);

      // Act
      const result = await depositService.getMyDeposit(authPayload);

      // Assert
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.data).toEqual(myDeposit);
    });
  });
});
