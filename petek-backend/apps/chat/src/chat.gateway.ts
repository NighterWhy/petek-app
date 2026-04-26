import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma.service';

interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Telefon Rehberi / Switchboard: userId -> socketId
  private activeUsers = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === client.id) {
        this.activeUsers.delete(userId);
        console.log(`User ${userId} removed from switchboard.`);
        break;
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!userId) return;
    this.activeUsers.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: SendMessagePayload,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Message from ${client.id}:`, data);

    const savedMessage = await this.prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
      },
    });

    const receiverSocketId = this.activeUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', savedMessage);
    } else {
      console.log(`User ${data.receiverId} is offline. Message stored only.`);
    }

    return savedMessage;
  }
}
