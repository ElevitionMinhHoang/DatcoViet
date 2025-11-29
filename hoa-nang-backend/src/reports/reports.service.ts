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

  async getRevenueByDay(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const revenueData = await this.prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'COMPLETED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Create an array for all days in the range
    const allDays: Array<{ date: string; revenue: number }> = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      allDays.push({
        date: date.toISOString().split('T')[0],
        revenue: 0,
      });
    }

    // Fill in actual revenue data
    revenueData.forEach(item => {
      const itemDate = item.createdAt.toISOString().split('T')[0];
      const dayIndex = allDays.findIndex(day => day.date === itemDate);
      if (dayIndex !== -1) {
        allDays[dayIndex].revenue = item._sum.total || 0;
      }
    });

    return allDays;
  }

  async getOrdersByStatus() {
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return ordersByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
    }));
  }

  async getSummaryByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalOrders = await this.prisma.order.count({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalCustomers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalCustomers
    };
  }

  async getRevenueByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const revenueData = await this.prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        status: 'COMPLETED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calculate number of days in range
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Create an array for all days in the range
    const allDays: Array<{ date: string; revenue: number }> = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      allDays.push({
        date: date.toISOString().split('T')[0],
        revenue: 0,
      });
    }

    // Fill in actual revenue data
    revenueData.forEach(item => {
      const itemDate = item.createdAt.toISOString().split('T')[0];
      const dayIndex = allDays.findIndex(day => day.date === itemDate);
      if (dayIndex !== -1) {
        allDays[dayIndex].revenue = item._sum.total || 0;
      }
    });

    return allDays;
  }

  async getOrdersByStatusByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return ordersByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
    }));
  }

  async getTopSellingMenuItemsByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const topMenuItems = await this.prisma.orderItem.groupBy({
      by: ['menuId'],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
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
}
