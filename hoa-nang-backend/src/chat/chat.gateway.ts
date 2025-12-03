import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:8081', 'http://127.0.0.1:8081', 'http://localhost:8082', 'http://127.0.0.1:8082'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, { userId: number; socketId: string }>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;

      this.connectedUsers.set(client.id, { userId, socketId: client.id });
      
      // Join user to their personal room
      client.join(`user_${userId}`);
      
      console.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      console.error('Authentication failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      console.log(`User ${user.userId} disconnected`);
      this.connectedUsers.delete(client.id);
    }
  }

  @SubscribeMessage('join_chat_room')
  async handleJoinChatRoom(client: Socket, roomId: number) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    client.join(`room_${roomId}`);
    console.log(`User ${user.userId} joined room ${roomId}`);
  }

  @SubscribeMessage('leave_chat_room')
  async handleLeaveChatRoom(client: Socket, roomId: number) {
    client.leave(`room_${roomId}`);
    
    const user = this.connectedUsers.get(client.id);
    if (user) {
      console.log(`User ${user.userId} left room ${roomId}`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(client: Socket, data: { roomId: number; message: string }) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Validate roomId
    if (!data.roomId || data.roomId <= 0) {
      console.error('Invalid roomId:', data.roomId);
      return { success: false, error: 'Invalid room ID' };
    }

    const createChatMessageDto: CreateChatMessageDto = {
      roomId: data.roomId,
      message: data.message,
    };

    try {
      const savedMessage = await this.chatService.createMessage(createChatMessageDto, user.userId);

      // Broadcast message to all users in the room
      console.log(`Emitting new_message to room_${data.roomId}`, savedMessage);
      this.server.to(`room_${data.roomId}`).emit('new_message', savedMessage);

      // Notify admin users about new message
      console.log(`Emitting new_message_notification to all users`);
      this.server.emit('new_message_notification', {
        roomId: data.roomId,
        message: savedMessage,
      });

      return { success: true, message: savedMessage };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('mark_messages_read')
  async handleMarkMessagesRead(client: Socket, roomId: number) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    await this.chatService.markMessagesAsRead(roomId, user.userId);
    
    // Notify other users in the room that messages were read
    this.server.to(`room_${roomId}`).emit('messages_read', {
      roomId,
      userId: user.userId,
    });
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(client: Socket, roomId: number) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Notify other users in the room that someone is typing
    client.to(`room_${roomId}`).emit('user_typing', {
      roomId,
      userId: user.userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(client: Socket, roomId: number) {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Notify other users in the room that typing stopped
    client.to(`room_${roomId}`).emit('user_typing', {
      roomId,
      userId: user.userId,
      isTyping: false,
    });
  }

  // Method to notify specific user about new message
  notifyUser(userId: number, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  // Method to notify all admin users
  notifyAdmins(event: string, data: any) {
    // This would need to be implemented based on your admin identification logic
    // For now, we'll emit to all connected users
    this.server.emit(event, data);
  }
}