import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './db/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthModule } from './modules/jwt/jwt.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { BidModule } from './modules/bid/bid.module';
import { WebsocketGateway } from './modules/websocket/websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    JwtAuthModule,
    AuthModule,
    DepositModule,
    BidModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
  exports: [ConfigModule],
})
export class AppModule {}
