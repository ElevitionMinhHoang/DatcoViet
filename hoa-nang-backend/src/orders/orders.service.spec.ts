import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            menu: {
              findMany: jest.fn(),
            },
            order: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        items: [
          { menuId: 1, quantity: 2 },
          { menuId: 2, quantity: 1 },
        ],
      };
      const userId = 1;
      const menuItems = [
        { id: 1, price: 10, isActive: true },
        { id: 2, price: 20, isActive: true },
      ];
      const createdOrder = { id: 1, userId, total: 40, items: [] };

      (prisma.menu.findMany as jest.Mock).mockResolvedValue(menuItems);
      (prisma.order.create as jest.Mock).mockResolvedValue(createdOrder);

      const result = await service.create(createOrderDto, userId);

      expect(prisma.menu.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: [1, 2] },
          isActive: true,
        },
      });
      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          userId,
          total: 40,
          items: {
            create: [
              { menuId: 1, quantity: 2, price: 10 },
              { menuId: 2, quantity: 1, price: 20 },
            ],
          },
        },
        include: {
            items: true,
        },
      });
      expect(result).toEqual(createdOrder);
    });

    it('should throw an error for invalid menu items', async () => {
      const createOrderDto = {
        items: [
          { menuId: 1, quantity: 2 },
          { menuId: 2, quantity: 1 },
        ],
      };
      const userId = 1;
      const menuItems = [{ id: 1, price: 10, isActive: true }];

      (prisma.menu.findMany as jest.Mock).mockResolvedValue(menuItems);

      await expect(service.create(createOrderDto, userId)).rejects.toThrow(
        new BadRequestException('One or more menu items are invalid or inactive.'),
      );
    });
  });
});
