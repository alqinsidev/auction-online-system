import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import HandleError from '../../utils/errorHandling.utils';
import { Deposit } from '../deposit/entities/deposit.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUserRepository: Repository<User>;
  let mockDataSource: DataSource;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as Repository<User>;

    mockDataSource = {
      createQueryRunner: jest.fn(),
    } as unknown as DataSource;

    usersService = new UsersService(mockUserRepository, mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockCreateUserDto: CreateUserDto = {
      full_name: 'test user',
      email: 'test@example.com',
      password: 'password',
    };

    it('should throw an error when email is already used', async () => {
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        manager: {
          findOne: jest.fn().mockResolvedValue({}),
        },
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      };

      (mockDataSource.createQueryRunner as jest.Mock).mockReturnValue(
        mockQueryRunner,
      );
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue({});

      await expect(usersService.create(mockCreateUserDto)).rejects.toThrow(
        'email has been used, try another email',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
