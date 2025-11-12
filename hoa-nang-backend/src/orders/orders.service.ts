import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const { items } = createOrderDto;

    const menuIds = items.map((item) => item.menuId);
    const menuItems = await this.prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        isActive: true,
      },
    });

    if (menuItems.length !== menuIds.length) {
      throw new BadRequestException('One or more menu items are invalid or inactive.');
    }

    const total = items.reduce((acc, item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuId);
      if (!menuItem) {
        return acc;
      }
      return acc + menuItem.price * item.quantity;
    }, 0);

    const createdOrder = await this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: items.map((item) => {
            const menuItem = menuItems.find((mi) => mi.id === item.menuId)!;
            return {
              menuId: item.menuId,
              quantity: item.quantity,
              price: menuItem.price,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    return createdOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({ include: { user: true, items: true } });
  }

  async findOne(id: number): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menu: true } }, user: true, payment: true, feedback: true, delivery: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findUserOrders(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
        where: { userId },
        include: { items: true }
    });
  }

  async confirm(id: number): Promise<Order> {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CONFIRMED },
    });
  }

  async cancel(id: number, userId: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.userId !== userId) {
        throw new BadRequestException('You are not authorized to cancel this order.');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order cannot be cancelled as it is in ${order.status} status.`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }
}
