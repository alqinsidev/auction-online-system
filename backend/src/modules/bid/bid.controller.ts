import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
  Put,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidItemDTO } from './dto/create-bid-item.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { MakeBidDTO } from './dto/make-bid.dto';
import { PublishBidDTO } from './dto/publish-bid.dto';
import { ApiTags } from '@nestjs/swagger';
import HandleErrorException from '../../utils/errorHandling.utils';
import { ResponseFormat } from 'src/utils/response.utils';

@Controller('bid')
@UseGuards(JwtAuthGuard)
@ApiTags('Bid Item')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('')
  async getBidItem(@Query('isDraft') isDraft: string, @Request() req: any) {
    try {
      const data = await this.bidService.getListBid(
        {
          isDraft: isDraft === 'true' ? true : false,
        },
        req.user,
      );
      return ResponseFormat(data);
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  @Get('auction')
  async getAuctionList(@Query('status') status: string, @Request() req: any) {
    try {
      const data = await this.bidService.getAuctionList({ status }, req.user);
      return ResponseFormat(data);
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  @Post('')
  async createBidItem(
    @Body() createBidItemDTO: CreateBidItemDTO,
    @Request() req: any,
  ) {
    try {
      const data = await this.bidService.createBidItem(
        createBidItemDTO,
        req.user,
      );
      return ResponseFormat(
        data,
        HttpStatus.CREATED,
        'new item has been added',
      );
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  @Put('')
  async publishBid(@Body() publishBidDTO: PublishBidDTO, @Request() req: any) {
    try {
      const data = await this.bidService.publishBid(publishBidDTO, req.user);
      return ResponseFormat(data, HttpStatus.OK, 'item has been listed');
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  @Post('new')
  async bidItem(@Body() makeBidDTO: MakeBidDTO, @Request() req: any) {
    try {
      const data = await this.bidService.makeBid(makeBidDTO, req.user);
      return ResponseFormat(data);
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  @Get('history/:id')
  async bidHistory(@Param('id') id: string) {
    try {
      const data = await this.bidService.getBidHistory(id);
      return data;
    } catch (error) {
      throw HandleErrorException(error);
    }
  }
}
