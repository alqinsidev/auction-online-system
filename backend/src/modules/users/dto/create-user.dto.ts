import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'padlan alqinsi' })
  full_name: string;
  @ApiProperty({ example: 'padlan@dev.co.id' })
  email: string;
  @ApiProperty({ example: 'padlan123!@#' })
  password: string;
}
