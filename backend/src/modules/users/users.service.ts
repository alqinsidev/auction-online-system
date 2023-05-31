import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Deposit } from '../deposit/entities/deposit.entity';
import { hashString } from '../../helpers/bcrypt.helper';
import {
  BadRequestError,
  NotFoundError,
} from '../../utils/errorHandling.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: {
          email: createUserDto.email,
        },
        select: ['id', 'email'],
      });

      if (user) {
        throw new BadRequestError('email has been used, try another email');
      }

      const newUserData = {
        ...createUserDto,
        password: await hashString(createUserDto.password),
      };

      const newUser = await queryRunner.manager.save(User, newUserData);

      const newDepositData = {
        user_id: newUser.id,
        amount: 0,
      };
      await queryRunner.manager.save(Deposit, newDepositData);

      await queryRunner.commitTransaction();

      return { user: newUser };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'full_name', 'email', 'created_at'],
        relations: { deposit: true },
      });
      if (!user) {
        throw new NotFoundError('user not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
