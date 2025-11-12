import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback, OrderStatus } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto, userId: number): Promise<Feedback> {
    const { orderId, rating, comment } = createFeedbackDto;

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.userId !== userId) {
        throw new BadRequestException('You can only provide feedback for your own orders.');
    }

    if (order.status !== OrderStatus.COMPLETED) {
        throw new BadRequestException('Feedback can only be provided for completed orders.');
    }

    const existingFeedback = await this.prisma.feedback.findUnique({ where: { orderId } });

    if (existingFeedback) {
        throw new BadRequestException('Feedback has already been submitted for this order.');
    }

    return this.prisma.feedback.create({
      data: {
        orderId,
        rating,
        comment,
      },
    });
  }

  async findAll(): Promise<Feedback[]> {
    return this.prisma.feedback.findMany();
  }

  async findOne(id: number): Promise<Feedback | null> {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
        throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async findByOrder(orderId: number): Promise<Feedback | null> {
    const feedback = await this.prisma.feedback.findUnique({ where: { orderId } });
    if (!feedback) {
        throw new NotFoundException(`Feedback for order with ID ${orderId} not found`);
    }
    return feedback;
  }

  async approve(id: number): Promise<Feedback> {
    await this.findOne(id);
    return this.prisma.feedback.update({
      where: { id },
      data: { isApproved: true },
    });
  }
}
