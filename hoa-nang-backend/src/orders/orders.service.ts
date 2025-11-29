import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    console.log('Creating order for user:', userId);
    console.log('Order data:', createOrderDto);
    
    const { items } = createOrderDto;

    const menuIds = items.map((item) => item.menuId);
    console.log('Menu IDs to validate:', menuIds);
    
    const menuItems = await this.prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        isActive: true,
      },
    });

    console.log('Found menu items:', menuItems.map(item => ({ id: item.id, name: item.name, isActive: item.isActive })));
    console.log('Menu items count:', menuItems.length, 'Requested count:', menuIds.length);

    if (menuItems.length !== menuIds.length) {
      const missingIds = menuIds.filter(id => !menuItems.find(item => item.id === id));
      console.log('Missing or inactive menu IDs:', missingIds);
      throw new BadRequestException('One or more menu items are invalid or inactive.');
    }

    // Calculate subtotal (product prices only)
    const subtotal = items.reduce((acc, item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuId);
      if (!menuItem) {
        return acc;
      }
      return acc + menuItem.price * item.quantity;
    }, 0);

    // Add shipping fee (20,000 VND)
    const shippingFee = 20000;
    const total = subtotal + shippingFee;

    console.log('Order calculation - Subtotal:', subtotal, 'Shipping:', shippingFee, 'Total:', total);

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

  async findAll() {
    return this.prisma.order.findMany({ include: { user: true, items: true } });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menu: true } }, user: true, payment: true, feedback: true, delivery: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findUserOrders(userId: number) {
    return this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              menu: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: true,
                }
              }
            }
          }
        }
    });
  }

  async confirm(id: number) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });
  }

  async cancel(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.userId !== userId) {
        throw new BadRequestException('You are not authorized to cancel this order.');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Order cannot be cancelled as it is in ${order.status} status.`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async findAllAdmin(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        payment: true,
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const totalOrders = await this.prisma.order.count();
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ['CONFIRMED', 'COMPLETED'],
        },
      },
    });

    const recentOrders = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    return {
      totalOrders,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
    };
  }

  async updateStatus(id: number, status: string) {
    const order = await this.findOne(id);
    
    // Validate status transition
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
