import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
// import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    console.log('Creating payment:', createPaymentDto);
    const { orderId, method, amount } = createPaymentDto;

    // Validate payment method - only COD is allowed
    if (method !== 'COD') {
      throw new BadRequestException('Chỉ chấp nhận thanh toán khi nhận hàng (COD)');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      console.log('Order not found:', orderId);
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    console.log('Found order:', order);

    // For COD payments, always mark as SUCCESS
    const paymentStatus = 'SUCCESS';

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        method,
        amount,
        status: paymentStatus,
      },
    });

    console.log('Payment created:', payment);
    return payment;
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByOrder(orderId: number) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) {
        throw new NotFoundException(`Payment for order with ID ${orderId} not found`);
    }
    return payment;
  }

  async refund(id: number) {
    const payment = await this.findOne(id);

    if (!payment || payment.status !== 'SUCCESS') {
      throw new BadRequestException('Only successful payments can be refunded.');
    }

    // Mock refund processing
    return this.prisma.payment.update({
      where: { id },
      data: { status: 'REFUNDED' },
    });
  }

  async getPaymentStats() {
    const totalPayments = await this.prisma.payment.count();
    
    const paymentsByStatus = await this.prisma.payment.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const totalRevenue = await this.prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'SUCCESS',
      },
    });

    const recentPayments = await this.prisma.payment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    return {
      totalPayments,
      paymentsByStatus: paymentsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      totalRevenue: totalRevenue._sum.amount || 0,
      recentPayments,
    };
  }
}
