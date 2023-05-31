import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import HandleErrorException from 'src/utils/errorHandling.utils';
import { ResponseMessage } from 'src/common/interface/response/response.interface';
import { LoginResponse } from 'src/common/interface/auth/auth.interface';
import { ResponseFormat } from 'src/utils/response.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDTO,
  ): Promise<ResponseMessage<LoginResponse>> {
    try {
      const data = await this.authService.login(loginDto);
      return ResponseFormat(data, HttpStatus.OK, 'successfully login');
    } catch (error) {
      throw HandleErrorException(error);
    }
  }
}
