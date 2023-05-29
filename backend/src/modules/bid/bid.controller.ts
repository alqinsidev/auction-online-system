import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidItemDTO } from './dto/create-bid-item.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { MakeBidDTO } from './dto/make-bid.dto';
import { PublishBidDTO } from './dto/publish-bid.dto';

@Controller('bid')
@UseGuards(JwtAuthGuard)
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('')
  getBidItem(@Query('isDraft') isDraft: string) {
    return this.bidService.getListBid({
      isDraft: isDraft === 'true' ? true : false,
    });
  }
  @Get('auction')
  getAuctionList(@Query('status') status: string, @Request() req: any) {
    return this.bidService.getAuctionList({ status }, req.user);
  }

  @Post('')
  createBidItem(
    @Body() createBidItemDTO: CreateBidItemDTO,
    @Request() req: any,
  ) {
    return this.bidService.createBidItem(createBidItemDTO, req.user);
  }

  @Put('')
  publishBid(@Body() publishBidDTO: PublishBidDTO, @Request() req: any) {
    return this.bidService.publishBid(publishBidDTO, req.user);
  }

  @Post('new')
  bidItem(@Body() makeBidDTO: MakeBidDTO, @Request() req: any) {
    return this.bidService.makeBid(makeBidDTO, req.user);
  }
}
