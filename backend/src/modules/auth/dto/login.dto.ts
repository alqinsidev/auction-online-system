import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'padlan@dev.co.id' })
  email: string;

  @ApiProperty({ example: 'padlan123' })
  password: string;
}
