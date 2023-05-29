import { ApiProperty } from '@nestjs/swagger';

export class CreateBidItemDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  start_price: number;
  @ApiProperty()
  time_window: number;
}
