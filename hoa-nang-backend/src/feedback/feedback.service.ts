import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
// import { Feedback, Order, OrderStatus } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto, userId: number): Promise<any> {
    const { orderId, rating, comment, images } = createFeedbackDto;

    // For order reviews, validate the order exists and belongs to user
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.userId !== userId) {
        throw new BadRequestException('You can only provide feedback for your own orders.');
    }

    if (order.status !== 'COMPLETED') {
        throw new BadRequestException('Feedback can only be provided for completed orders.');
    }

    const existingFeedback = await this.prisma.feedback.findUnique({
      where: { orderId },
      select: {
        id: true,
        orderId: true,
        rating: true,
        comment: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (existingFeedback) {
        throw new BadRequestException('Feedback has already been submitted for this order.');
    }

    return this.prisma.feedback.create({
      data: {
        orderId,
        rating,
        comment,
        // images: images || [], // Temporarily disabled until migration completes
      },
      select: {
        id: true,
        orderId: true,
        rating: true,
        comment: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.feedback.findMany({
      select: {
        id: true,
        orderId: true,
        rating: true,
        comment: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findOne(id: number): Promise<any | null> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      select: {
        id: true,
        orderId: true,
        rating: true,
        comment: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!feedback) {
        throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async findByOrder(orderId: number): Promise<any | null> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { orderId },
      select: {
        id: true,
        orderId: true,
        rating: true,
        comment: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return feedback; // Return null if not found instead of throwing error
  }


  async approve(id: number): Promise<any> {
    await this.findOne(id);
    return this.prisma.feedback.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async reject(id: number): Promise<any> {
    await this.findOne(id);
    return this.prisma.feedback.update({
      where: { id },
      data: { isApproved: false },
    });
  }

  async findByMenu(menuId: number): Promise<any[]> {
    // Find all orders that contain this menu item
    const ordersWithMenu = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            menuId: menuId,
          },
        },
        status: 'COMPLETED', // Only get reviews from completed orders
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        feedback: {
          select: {
            id: true,
            orderId: true,
            rating: true,
            comment: true,
            isApproved: true,
            createdAt: true,
            updatedAt: true
          }
        },
      },
    });

    // Filter orders that have feedback and return the feedback with user info
    const reviews = ordersWithMenu
      .filter(order => order.feedback)
      .map(order => {
        const feedback = order.feedback!; // We already filtered out null feedback
        return {
          id: feedback.id,
          orderId: feedback.orderId,
          customerId: order.user.id,
          customerName: order.user.name,
          rating: feedback.rating,
          comment: feedback.comment,
          images: [], // Temporary empty array until migration completes
          isApproved: feedback.isApproved,
          createdAt: feedback.createdAt,
          updatedAt: feedback.updatedAt,
        };
      });

    return reviews;
  }
}
