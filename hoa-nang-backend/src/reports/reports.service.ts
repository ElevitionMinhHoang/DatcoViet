import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: OrderStatus.COMPLETED,
      },
    });

    const totalOrders = await this.prisma.order.count({
        where: {
            status: OrderStatus.COMPLETED,
        },
    });

    const totalCustomers = await this.prisma.user.count();

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalCustomers
    };
  }

  async getTopSellingMenuItems() {
    const topMenuItems = await this.prisma.orderItem.groupBy({
      by: ['menuId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const menuIds = topMenuItems.map((item) => item.menuId);
    const menus = await this.prisma.menu.findMany({
      where: {
        id: { in: menuIds },
      },
    });

    return topMenuItems.map((item) => {
      const menu = menus.find((m) => m.id === item.menuId);
      return {
        ...menu,
        totalQuantity: item._sum.quantity,
      };
    });
  }

  async getTopCustomers() {
    const topCustomers = await this.prisma.order.groupBy({
      by: ['userId'],
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    });

    const userIds = topCustomers.map((item) => item.userId);
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
    });

    return topCustomers.map((item) => {
      const user = users.find((u) => u.id === item.userId);
      return {
        ...user,
        totalSpent: item._sum.total,
      };
    });
  }
}
