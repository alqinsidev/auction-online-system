import { ApiProperty } from '@nestjs/swagger';

export class StoreDepositDTO {
  @ApiProperty({ example: 10 })
  store_amount: number;
}
