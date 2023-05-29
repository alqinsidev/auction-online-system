import 'dotenv/config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBidItemDTO } from './dto/create-bid-item.dto';
import { AuthPayload } from 'src/common/interface/auth/auth.interface';
import { DataSource, Not, Repository, Timestamp } from 'typeorm';
import { BidItem } from './entities/bid-item.entity';
import { ResponseMessage } from '../../common/interface/response/response.interface';
import HandleErrorException from '../../utils/errorHandler';
import { MakeBidDTO } from './dto/make-bid.dto';
import { BidHistory } from './entities/bid-history.entity';
import { Deposit } from '../deposit/entities/deposit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PublishBidDTO } from './dto/publish-bid.dto';
import * as amqp from 'amqplib';
import * as moment from 'moment';
import amqpHelper from '../../utils/amqpHelper';
import { AmqpPublishPayload } from '../../common/interface/amqp/amqp.interface';
import { DepositHistory } from '../deposit/entities/deposit-history.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import * as Sentry from '@sentry/node';

@Injectable()
export class BidService {
  private async consumeMessages() {
    try {
      const connection = await amqp.connect(process.env.AMQP_URL);
      const channel = await connection.createChannel();

      const exchangeName = 'AUCTION_EXCHANGE';
      const queueName = 'AUCTION_QUEUE';
      const routingKey = '';

      await channel.assertExchange(exchangeName, 'x-delayed-message', {
        durable: true,
        arguments: {
          'x-delayed-type': 'direct',
        },
      });

      const queue = await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queue.queue, exchangeName, routingKey);

      await channel.consume(queue.queue, (msg: amqp.ConsumeMessage | null) => {
        if (msg !== null) {
          const payload: AmqpPublishPayload = JSON.parse(
            msg.content.toString(),
          );
          console.log('incoming message from the past', payload);
          if (payload.task === 'AUTO_CLOSE_AUCTION') {
            this.closeBid(payload.payload?.bid_id || '');
          }
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  }
  constructor(
    private dataSource: DataSource,
    @InjectRepository(BidItem)
    private bidItemRepository: Repository<BidItem>,
    private ws: WebsocketGateway,
  ) {
    this.consumeMessages();
  }

  async getListBid(
    { isDraft = false },
    authPayload: AuthPayload,
  ): Promise<ResponseMessage<any>> {
    try {
      const queryBuilder = this.bidItemRepository
        .createQueryBuilder('bid_items')
        .select([
          'bid_items.id',
          'bid_items.name',
          'bid_items.start_price',
          'bid_items.last_price',
          'bid_items.isDraft',
          'bid_items.isCompleted',
          'bid_items.start_date',
          'bid_items.end_date',
          'bid_items.created_at',
          'bid_items.updated_at',
          'users.id',
          'users.full_name',
        ])
        .leftJoin('bid_items.user', 'users')
        .where('bid_items.user_id = :user_id', { user_id: authPayload.id })
        .orderBy('bid_items.updated_at', 'DESC');

      if (isDraft) {
        queryBuilder.andWhere('bid_items.isDraft = :isDraft', { isDraft });
      }

      const res = await queryBuilder.getMany();
      return {
        status: HttpStatus.OK,
        data: res,
      };
    } catch (error) {
      throw HandleErrorException(error);
    }
  }
  async getAuctionList(
    { status = undefined },
    authPayload: AuthPayload,
  ): Promise<ResponseMessage<any>> {
    try {
      const queryBuilder = this.bidItemRepository
        .createQueryBuilder('bid_items')
        .select([
          'bid_items.id',
          'bid_items.name',
          'bid_items.start_price',
          'bid_items.last_price',
          'bid_items.isDraft',
          'bid_items.isCompleted',
          'bid_items.start_date',
          'bid_items.end_date',
          'bid_items.created_at',
          'bid_items.updated_at',
          'users.id',
          'users.full_name',
        ])
        .leftJoin('bid_items.user', 'users')
        .where(`bid_items.user_id != :user_id`, { user_id: authPayload.id })
        .andWhere(`bid_items.isDraft = false`)
        .orderBy(`bid_items.updated_at`, 'DESC');

      if (status) {
        if (status === 'ongoing') {
          queryBuilder.andWhere('bid_items.isCompleted = false');
        } else if (
          status === 'completed' ||
          status === 'done' ||
          status === 'closed'
        ) {
          queryBuilder.andWhere('bid_items.isCompleted = true');
        }
      }

      const res = await queryBuilder.getMany();
      return {
        status: HttpStatus.OK,
        data: res,
      };
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  async createBidItem(
    createBidItemDTO: CreateBidItemDTO,
    authPayload: AuthPayload,
  ): Promise<ResponseMessage<any>> {
    try {
      const newBidItemData = this.bidItemRepository.create({
        ...createBidItemDTO,
        user_id: authPayload.id,
        last_price: createBidItemDTO.start_price,
      });
      const newBidItem = await this.bidItemRepository.save(newBidItemData);
      return {
        status: HttpStatus.CREATED,
        data: newBidItem,
        message: 'New item has been added',
      };
    } catch (error) {
      console.error(error);

      throw HandleErrorException(error);
    }
  }

  async publishBid(
    publishBidDTO: PublishBidDTO,
    authPayload: AuthPayload,
  ): Promise<ResponseMessage<any>> {
    try {
      const bid = await this.bidItemRepository.findOne({
        where: { id: publishBidDTO.bid_id },
      });
      if (!bid) {
        throw 'bid not found';
      }
      if (authPayload.id !== bid.user_id) {
        throw 'you dont have authorization on this bid';
      }
      if (!bid.isDraft) {
        throw 'bid already published';
      }

      const lastBid = await this.bidItemRepository.findOne({
        where: {
          id: Not(publishBidDTO.bid_id),
          user_id: authPayload.id,
        },
        order: {
          created_at: 'DESC',
        },
      });

      if (lastBid) {
        const timeDifference = moment.duration(
          moment().diff(moment(lastBid.created_at as moment.MomentInput)),
        );

        if (timeDifference.asSeconds() < 5) {
          throw 'you need to wait 5s after your published a bid';
        }
      }

      bid.isDraft = false;
      bid.start_date = moment().toISOString() as unknown as Timestamp;
      bid.end_date = moment()
        .add(bid.time_window, 'hours')
        .toISOString() as unknown as Timestamp;
      const updatedBid = await this.bidItemRepository.save(bid);

      const millisecondRemainingUntilEndDate = updatedBid.time_window * 3600000;

      amqpHelper.publishMessage(
        {
          task: 'AUTO_CLOSE_AUCTION',
          payload: { bid_id: updatedBid.id },
        },
        millisecondRemainingUntilEndDate,
      );

      const socketClient = this.ws.getServer();
      socketClient.emit('AUCTION_EVENT', updatedBid);
      return {
        status: HttpStatus.OK,
        data: updatedBid,
        message: 'bid has been published',
      };
    } catch (error) {
      throw HandleErrorException(error);
    }
  }

  async makeBid(
    makeBidDto: MakeBidDTO,
    authPayload: AuthPayload,
  ): Promise<ResponseMessage<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const bidItem = await queryRunner.manager.findOne(BidItem, {
        where: { id: makeBidDto.bid_id },
      });

      if (!bidItem) {
        throw 'bid not found';
      }

      const currentUserDeposit = await queryRunner.manager.findOne(Deposit, {
        where: { user_id: authPayload.id },
      });

      if (bidItem.isDraft) {
        throw 'bid still not open yet';
      }

      const auctionHasOver =
        moment().isAfter(
          moment(bidItem.end_date as unknown as moment.MomentInput),
        ) || bidItem.isCompleted;

      if (auctionHasOver) {
        throw 'auction for this item was closed';
      }

      if (bidItem.user_id === authPayload.id) {
        throw `you can't bid for your item`;
      }

      if (makeBidDto.bid_amount > currentUserDeposit.amount) {
        throw 'you have unsuficent deposit';
      }

      if (bidItem.last_price >= makeBidDto.bid_amount) {
        throw 'bid amount must be higher than last bid price';
      }

      const lastBidOnThisItem = await queryRunner.manager.findOne(BidHistory, {
        where: {
          bid_id: bidItem.id,
          user_id: authPayload.id,
        },
        order: {
          created_at: 'DESC',
        },
      });

      let depositBill = makeBidDto.bid_amount;

      if (lastBidOnThisItem) {
        depositBill = makeBidDto.bid_amount - lastBidOnThisItem.bid_amount;

        const timeDifference = moment.duration(
          moment().diff(
            moment(lastBidOnThisItem.created_at as moment.MomentInput),
          ),
        );

        if (timeDifference.asSeconds() < 5) {
          throw 'you need to wait 5s after your last bid';
        }
      }
      currentUserDeposit.amount = currentUserDeposit.amount - depositBill;

      await queryRunner.manager.save(currentUserDeposit);

      bidItem.last_price = makeBidDto.bid_amount;
      const updatedBidItem = await queryRunner.manager.save(BidItem, bidItem);

      const bidHistoryData = { ...makeBidDto, user_id: authPayload.id };
      await queryRunner.manager.save(BidHistory, bidHistoryData);

      await queryRunner.commitTransaction();

      const socketClient = this.ws.getServer();
      socketClient.emit('AUCTION_EVENT', updatedBidItem);
      return {
        data: updatedBidItem,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);

      throw HandleErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async closeBid(bid_id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // check the highest bid for the item
      // take all failed bid and retur the deposit

      const listBid: { user_id: string; last_price: string | number }[] =
        await queryRunner.manager
          .getRepository(BidHistory)
          .createQueryBuilder('bid_history')
          .select('MAX(bid_history.bid_amount)', 'last_price')
          .addSelect('bid_history.user_id', 'user_id')
          .where('bid_history.bid_id = :bid_id', { bid_id })
          .groupBy('bid_history.user_id')
          .orderBy('last_price', 'DESC')
          .getRawMany();

      const returnDepositArray = [...listBid];
      returnDepositArray.shift();
      if (returnDepositArray.length > 0) {
        await Promise.all(
          returnDepositArray.map(
            async (bid: { user_id: string; last_price: string | number }) => {
              const currentBidderDeposit = await queryRunner.manager.findOne(
                Deposit,
                {
                  where: { user_id: bid.user_id },
                },
              );
              currentBidderDeposit.amount =
                currentBidderDeposit.amount + Number(bid.last_price);
              await queryRunner.manager.save(Deposit, currentBidderDeposit);
              const returnDeposit = {
                user_id: bid.user_id,
                amount: Number(bid.last_price),
                isReturn: true,
              };
              await queryRunner.manager.save(DepositHistory, returnDeposit);
            },
          ),
        );
      }

      const bidItem = await queryRunner.manager.findOne(BidItem, {
        where: { id: bid_id },
      });

      const myDeposit = await queryRunner.manager.findOne(Deposit, {
        where: { user_id: bidItem.user_id },
      });

      let winnerId = null;
      if (listBid.length > 0) {
        winnerId = listBid[0].user_id;
        myDeposit.amount = myDeposit.amount + Number(listBid[0].last_price);
        await queryRunner.manager.save(Deposit, myDeposit);
      }
      // update status to closed and update the winner
      bidItem.isCompleted = true;
      bidItem.winner_id = winnerId;
      await queryRunner.manager.save(BidItem, bidItem);
      await queryRunner.commitTransaction();

      const socketClient = this.ws.getServer();
      socketClient.emit('AUCTION_EVENT', bidItem);
      socketClient.emit('DEPOSIT_EVENT', bidItem);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
