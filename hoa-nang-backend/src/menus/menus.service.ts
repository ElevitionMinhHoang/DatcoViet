import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from '@prisma/client';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.prisma.menu.create({ data: createMenuDto });
  }

  async findAll(): Promise<Menu[]> {
    return this.prisma.menu.findMany({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Menu | null> {
    return this.prisma.menu.findUnique({ where: { id } });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  async remove(id: number): Promise<Menu> {
    return this.prisma.menu.delete({ where: { id } });
  }
}
