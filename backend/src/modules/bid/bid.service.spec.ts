import { Test } from '@nestjs/testing';
import { AuthPayload } from 'src/common/interface/auth/auth.interface';
import { BidService } from './bid.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BidItem } from './entities/bid-item.entity';
import { BidHistory } from './entities/bid-history.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { Deposit } from '../deposit/entities/deposit.entity';
import { DepositHistory } from '../deposit/entities/deposit-history.entity';

describe('BidService', () => {
  const authPayload: AuthPayload = {
    id: '1',
    fullname: 'test',
    email: 'test@example.com',
  };
  let bidService: BidService;
  let ws: WebsocketGateway;
  let bidItemRepository: Repository<BidItem>;
  let bidHistoryRepository: Repository<BidHistory>;
  let depositRepository: Repository<Deposit>;
  let depositHistoryRepository: Repository<DepositHistory>;

  const mockWs = {
    getServer: jest.fn(() => ({
      emit: jest.fn(),
    })),
  };

  const dataSourceMock = {
    createQueryRunner: jest.fn(),
  };

  const repositoryMock = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BidService,
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        {
          provide: getRepositoryToken(BidItem),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(BidHistory),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Deposit),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DepositHistory),
          useClass: Repository,
        },
        {
          provide: WebsocketGateway,
          useValue: mockWs,
        },
      ],
    }).compile();

    bidService = moduleRef.get<BidService>(BidService);
    bidItemRepository = moduleRef.get<Repository<BidItem>>(
      getRepositoryToken(BidItem),
    );
    bidHistoryRepository = moduleRef.get(getRepositoryToken(BidHistory));
    depositRepository = moduleRef.get<Repository<Deposit>>(
      getRepositoryToken(Deposit),
    );
    depositHistoryRepository = moduleRef.get<Repository<DepositHistory>>(
      getRepositoryToken(DepositHistory),
    );
    ws = moduleRef.get<WebsocketGateway>(WebsocketGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListBid', () => {
    it('should retun bid list', async () => {
      const mockedBidItem = new BidItem();
      mockedBidItem.id = '1';
      mockedBidItem.name = 'bid item';
      mockedBidItem.isCompleted = false;
      mockedBidItem.isDraft = true;
      mockedBidItem.description = 'bid item';
      mockedBidItem.time_window = 1;
      mockedBidItem.user_id = '1';

      const queryRunnerMock = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        release: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager: { getRepository: jest.fn() },
      };
      dataSourceMock.createQueryRunner.mockReturnValue(queryRunnerMock);

      const getMany = jest.fn(() => [mockedBidItem]);
      const orderBy = jest.fn(() => ({ getMany }));
      const where = jest.fn(() => ({ orderBy }));
      const leftJoin = jest.fn(() => ({ where }));
      const leftJoin1 = jest.fn(() => ({ leftJoin: leftJoin }));
      const select = jest.fn(() => ({ leftJoin: leftJoin1 }));

      const createQueryBuilderMock = jest.fn(() => ({
        select,
        leftJoin,
        where,
        getMany,
        orderBy,
      }));

      bidItemRepository.createQueryBuilder = createQueryBuilderMock as any;
      const result = await bidService.getListBid(
        { isDraft: false },
        authPayload,
      );

      expect(result).toEqual([mockedBidItem]);
    });
  });
});
