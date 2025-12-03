import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createOrGetChatRoom(userId: number) {
    console.log(`Creating or getting chat room for user ${userId}`);
    
    // First try to find an existing active chat room for this user
    let chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    console.log(`Found existing chat room:`, chatRoom ? chatRoom.id : 'none');

    if (!chatRoom) {
      console.log(`Creating new chat room for user ${userId}`);
      // Create a new chat room if none exists
      chatRoom = await this.prisma.chatRoom.create({
        data: {
          userId: userId,
          status: 'ACTIVE',
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
      console.log(`Created new chat room with ID: ${chatRoom.id}`);
    }

    return chatRoom;
  }

  async createMessage(createChatMessageDto: CreateChatMessageDto, senderId: number) {
    const { roomId, message } = createChatMessageDto;

    // Validate room exists
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new Error(`Chat room with ID ${roomId} not found`);
    }

    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        message,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        room: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Update room's updatedAt timestamp
    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    return chatMessage;
  }

  async getChatRoomMessages(roomId: number) {
    if (!roomId) {
      throw new Error('Room ID is required');
    }
    
    return this.prisma.chatMessage.findMany({
      where: {
        roomId: {
          equals: roomId,
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getUserChatRooms() {
    return this.prisma.chatRoom.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async markMessagesAsRead(roomId: number, userId: number) {
    await this.prisma.chatMessage.updateMany({
      where: {
        roomId: roomId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadMessageCount(userId: number) {
    const userChatRooms = await this.prisma.chatRoom.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
      },
    });

    const roomIds = userChatRooms.map(room => room.id);

    return this.prisma.chatMessage.count({
      where: {
        roomId: {
          in: roomIds,
        },
        senderId: {
          not: userId,
        },
        isRead: false,
      },
    });
  }

  async closeChatRoom(roomId: number) {
    return this.prisma.chatRoom.update({
      where: {
        id: roomId,
      },
      data: {
        status: 'CLOSED',
      },
    });
  }
}