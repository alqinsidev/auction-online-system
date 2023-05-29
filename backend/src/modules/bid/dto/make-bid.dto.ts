import { ApiProperty } from '@nestjs/swagger';

export class MakeBidDTO {
  @ApiProperty()
  bid_id: string;

  @ApiProperty()
  bid_amount: number;
}
