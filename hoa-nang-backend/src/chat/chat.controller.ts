import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('room')
  async getOrCreateChatRoom(@Request() req) {
    const userId = req.user.userId;
    return this.chatService.createOrGetChatRoom(userId);
  }

  @Get('rooms')
  @Roles(Role.ADMIN, Role.CSKH, Role.MANAGER)
  async getUserChatRooms() {
    return this.chatService.getUserChatRooms();
  }

  @Get('room/:roomId/messages')
  async getChatRoomMessages(@Param('roomId') roomId: string) {
    return this.chatService.getChatRoomMessages(parseInt(roomId));
  }

  @Post('message')
  async createMessage(@Body() createChatMessageDto: CreateChatMessageDto, @Request() req) {
    const senderId = req.user.userId;
    return this.chatService.createMessage(createChatMessageDto, senderId);
  }

  @Post('room/:roomId/read')
  async markMessagesAsRead(@Param('roomId') roomId: string, @Request() req) {
    const userId = req.user.userId;
    await this.chatService.markMessagesAsRead(parseInt(roomId), userId);
    return { message: 'Messages marked as read' };
  }

  @Get('unread-count')
  async getUnreadMessageCount(@Request() req) {
    const userId = req.user.userId;
    const count = await this.chatService.getUnreadMessageCount(userId);
    return { count };
  }

  @Post('room/:roomId/close')
  @Roles(Role.ADMIN, Role.CSKH, Role.MANAGER)
  async closeChatRoom(@Param('roomId') roomId: string) {
    return this.chatService.closeChatRoom(parseInt(roomId));
  }
}