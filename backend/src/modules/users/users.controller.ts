import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ResponseFormat } from 'src/utils/response.utils';
import HandleErrorException from 'src/utils/errorHandling.utils';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const data = await this.usersService.create(createUserDto);
      return ResponseFormat(data, HttpStatus.CREATED, 'user has been created');
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.usersService.findOne(id);
      return ResponseFormat(data);
    } catch (error) {
      throw HandleErrorException(error);
    }
  }
}
