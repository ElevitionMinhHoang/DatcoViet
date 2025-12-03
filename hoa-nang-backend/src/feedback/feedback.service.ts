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
    const feedbacks = await this.prisma.feedback.findMany({
      select: {
        id: true,
        orderId: true,
        rating: true,
        comment: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
        order: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: {
              select: {
                menu: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match frontend expectations
    return feedbacks.map((feedback) => {
      const order = feedback.order;
      const customerName = order?.user?.name || 'Khách hàng';
      const customerId = order?.user?.id || 0;
      // Determine dish name(s)
      const items = order?.items || [];
      let dishName = 'Không xác định';
      if (items.length > 0) {
        const firstItem = items[0];
        dishName = firstItem.menu?.name || 'Không xác định';
        if (items.length > 1) {
          dishName += ` và ${items.length - 1} món khác`;
        }
      }

      return {
        id: feedback.id,
        orderId: feedback.orderId,
        customerId,
        customerName,
        rating: feedback.rating,
        comment: feedback.comment,
        images: [], // Temporary empty array until migration completes
        status: feedback.isApproved ? 'approved' : 'pending',
        createdAt: feedback.createdAt,
        approvedAt: feedback.isApproved ? feedback.updatedAt : undefined,
        dishName,
      };
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


  async remove(id: number): Promise<any> {
    await this.findOne(id);
    return this.prisma.feedback.delete({
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
