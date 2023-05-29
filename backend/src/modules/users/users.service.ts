import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Deposit } from '../deposit/entities/deposit.entity';
import { hashString } from 'src/helpers/bcrypt.helper';
import HandleError from 'src/utils/errorHandler';
import { ResponseMessage } from 'src/common/interface/response/response.interface';
import HandleErrorException from 'src/utils/errorHandler';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
        throw 'email has been used, try another email';
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

      return {
        status: HttpStatus.CREATED,
        data: { user: newUser },
        message: 'user has been created',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw HandleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<ResponseMessage<any>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'full_name', 'email', 'created_at'],
        relations: { deposit: true },
      });
      if (!user) {
        throw 'user not found';
      }
      return {
        status: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
