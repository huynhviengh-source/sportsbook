import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect,
  MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/bookings' })
export class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`[WS] connect: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`[WS] disconnect: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { court_id: string; date: string }) {
    client.join(`${data.court_id}__${data.date}`);
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { court_id: string; date: string }) {
    client.leave(`${data.court_id}__${data.date}`);
  }

  emitSlotBooked(courtId: string, date: string, startHour: number) {
    this.server.to(`${courtId}__${date}`).emit('slot_booked', { start_hour: startHour });
  }

  emitSlotCancelled(courtId: string, date: string, startHour: number) {
    this.server.to(`${courtId}__${date}`).emit('slot_cancelled', { start_hour: startHour });
  }
}