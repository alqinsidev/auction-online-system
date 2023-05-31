// auth.service.ts
import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtAuthService } from '../jwt/jwt.service';
import { LoginResponse } from '../../common/interface/auth/auth.interface';
import { UserData } from '../../common/interface/user/user.interface';
import { compareHash } from '../../helpers/bcrypt.helper';
import {
  BadRequestError,
  NotFoundError,
} from '../../utils/errorHandling.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async login(loginDto: LoginDTO): Promise<LoginResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: loginDto.email,
        },
        relations: { deposit: true },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const isPasswordMatch = await compareHash(
        loginDto.password,
        user.password,
      );

      if (!isPasswordMatch) {
        throw new BadRequestError('Password not match');
      }

      const userData: UserData = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        deposit: user.deposit,
      };

      const accessToken = await this.jwtAuthService.generateToken(
        JSON.stringify(userData),
      );
      const data: LoginResponse = { accessToken, userData };
      return data;
    } catch (error) {
      throw error;
    }
  }
}
