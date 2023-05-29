// auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtAuthService } from '../jwt/jwt.service';
import { ResponseMessage } from 'src/common/interface/response/response.interface';
import { AuthResponse } from 'src/common/interface/auth/auth.interface';
import { UserData } from 'src/common/interface/user/user.interface';
import SentryHandleExeption from 'src/utils/errorHandler';
import { compareHash } from 'src/helpers/bcrypt.helper';
import HandleErrorException from 'src/utils/errorHandler';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async login(loginDto: LoginDTO): Promise<ResponseMessage<AuthResponse>> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: loginDto.email,
        },
        relations: { deposit: true },
      });

      if (!user) {
        throw 'user not found';
      }

      const isPasswordMatch = await compareHash(
        loginDto.password,
        user.password,
      );

      if (!isPasswordMatch) {
        throw 'password not match';
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
      const data: AuthResponse = { accessToken, userData };
      return {
        status: HttpStatus.OK,
        data,
        message: 'login successfully',
      };
    } catch (error) {
      throw HandleErrorException(error);
    }
  }
}
