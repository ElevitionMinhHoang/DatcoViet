import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { orderId, method } = createPaymentDto;

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Mock payment processing
    const paymentStatus =
      Math.random() > 0.2 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

    return this.prisma.payment.create({
      data: {
        orderId,
        method,
        amount: order.total,
        status: paymentStatus,
      },
    });
  }

  async findOne(id: number): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByOrder(orderId: number): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) {
        throw new NotFoundException(`Payment for order with ID ${orderId} not found`);
    }
    return payment;
  }

  async refund(id: number): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Only successful payments can be refunded.');
    }

    // Mock refund processing
    return this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.REFUNDED },
    });
  }
}
