import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-admin')
  handleJoinAdmin(@ConnectedSocket() client: Socket) {
    client.join('admin-room');
    this.logger.log(`Client ${client.id} joined admin room`);
    return { event: 'joined-admin', data: 'Successfully joined admin room' };
  }

  @SubscribeMessage('join-client')
  handleJoinClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { clientId: string }
  ) {
    client.join(`client-${data.clientId}`);
    this.logger.log(`Client ${client.id} joined room for client ${data.clientId}`);
    return { event: 'joined-client', data: `Successfully joined client room ${data.clientId}` };
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    return { event: 'pong', data: 'Connection alive' };
  }
}


// add validation status notification