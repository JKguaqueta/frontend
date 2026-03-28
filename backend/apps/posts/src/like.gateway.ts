import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/likes' })
export class LikesGateway {
  @WebSocketServer() server!: Server;

  emitLikeUpdated(payload: { postId: string; likeCount: number }) {
    this.server.emit('likeUpdated', payload);
  }
}
