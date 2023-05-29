import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidItem } from './entities/bid-item.entity';
import { BidHistory } from './entities/bid-history.entity';
import { Deposit } from '../deposit/entities/deposit.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([BidItem, BidHistory, Deposit])],
  controllers: [BidController],
  providers: [BidService, WebsocketGateway],
})
export class BidModule {}
