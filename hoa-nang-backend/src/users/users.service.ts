import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(search?: string) {
    try {
      const where: any = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const users = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get order counts for each user with error handling
      const usersWithOrderCounts = await Promise.all(
        users.map(async (user) => {
          try {
            const orderCount = await this.prisma.order.count({
              where: { userId: user.id },
            });
            return {
              ...user,
              orderCount,
            };
          } catch (error) {
            console.error(`Error counting orders for user ${user.id}:`, error);
            return {
              ...user,
              orderCount: 0,
            };
          }
        })
      );

      return usersWithOrderCounts;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });

    const recentUsers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    return {
      totalUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      recentUsers,
    };
  }
  async findOneAdmin(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          failedLoginAttempts: true,
          isLocked: true,
          passwordChangedAt: true,
          passwordChangeCount: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get order count and order details
      const orderCount = await this.prisma.order.count({
        where: { userId: id },
      });

      const orders = await this.prisma.order.findMany({
        where: { userId: id },
        include: {
          items: {
            include: {
              menu: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10, // Get last 10 orders
      });

      // Get total spent
      const totalSpentResult = await this.prisma.order.aggregate({
        where: {
          userId: id,
          status: { in: ['COMPLETED', 'CONFIRMED'] }
        },
        _sum: {
          total: true,
        },
      });

      return {
        ...user,
        orderCount,
        orders,
        totalSpent: totalSpentResult._sum.total || 0,
      };
    } catch (error) {
      console.error('Error finding user details:', error);
      throw error;
    }
  }

  async update(id: number, updateUserDto: any) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
