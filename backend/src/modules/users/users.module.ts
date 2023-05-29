import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Deposit } from '../deposit/entities/deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Deposit])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
