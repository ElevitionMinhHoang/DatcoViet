import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery, Role, OrderStatus } from '@prisma/client';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const { orderId, shipperId } = createDeliveryDto;

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.CONFIRMED) {
        throw new BadRequestException('Deliveries can only be created for confirmed orders.');
    }

    const shipper = await this.prisma.user.findUnique({ where: { id: shipperId } });

    if (!shipper || shipper.role !== Role.SHIPPER) {
      throw new BadRequestException('Invalid shipper ID.');
    }

    const existingDelivery = await this.prisma.delivery.findUnique({ where: { orderId } });

    if (existingDelivery) {
        throw new BadRequestException('A delivery has already been created for this order.');
    }

    return this.prisma.delivery.create({
      data: {
        orderId,
        shipperId,
      },
    });
  }

  async findAll(): Promise<Delivery[]> {
    return this.prisma.delivery.findMany();
  }

  async findOne(id: number): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({ where: { id } });
    if (!delivery) {
        throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    return delivery;
  }

  async findByOrder(orderId: number): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) {
        throw new NotFoundException(`Delivery for order with ID ${orderId} not found`);
    }
    return delivery;
  }

  async findByShipper(shipperId: number): Promise<Delivery[]> {
    return this.prisma.delivery.findMany({ where: { shipperId } });
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    await this.findOne(id);
    return this.prisma.delivery.update({
      where: { id },
      data: { status: updateDeliveryDto.status },
    });
  }
}
