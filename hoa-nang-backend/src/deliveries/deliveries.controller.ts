import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('deliveries')
@ApiBearerAuth()
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new delivery' })
  @ApiResponse({ status: 201, description: 'Delivery successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.CSKH)
  @ApiOperation({ summary: 'Get all deliveries (for admin/staff)' })
  @ApiResponse({ status: 200, description: 'Deliveries successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.deliveriesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific delivery' })
  @ApiResponse({ status: 200, description: 'Delivery successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Delivery not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deliveriesService.findOne(id);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the delivery for a specific order' })
  @ApiResponse({ status: 200, description: 'Delivery successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Delivery not found.' })
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.deliveriesService.findByOrder(orderId);
  }

  @Get('shipper/:shipperId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all deliveries for a specific shipper' })
  @ApiResponse({ status: 200, description: 'Deliveries successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findByShipper(@Param('shipperId', ParseIntPipe) shipperId: number) {
    return this.deliveriesService.findByShipper(shipperId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.SHIPPER)
  @ApiOperation({ summary: 'Update a delivery status' })
  @ApiResponse({ status: 200, description: 'Delivery successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Delivery not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveriesService.update(id, updateDeliveryDto);
  }
}
