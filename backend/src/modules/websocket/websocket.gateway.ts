import 'dotenv/config';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  getServer() {
    return this.server;
  }
}
