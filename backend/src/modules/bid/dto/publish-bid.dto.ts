import { ApiProperty } from '@nestjs/swagger';

export class PublishBidDTO {
  @ApiProperty()
  bid_id: string;
}
