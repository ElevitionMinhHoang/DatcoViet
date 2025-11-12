import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('feedback')
@ApiBearerAuth()
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit feedback for an order' })
  @ApiResponse({ status: 201, description: 'Feedback successfully submitted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: Request) {
    return this.feedbackService.create(createFeedbackDto, req.user['userId']);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.CSKH)
  @ApiOperation({ summary: 'Get all feedback (for admin/staff)' })
  @ApiResponse({ status: 200, description: 'Feedback successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific feedback' })
  @ApiResponse({ status: 200, description: 'Feedback successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.findOne(id);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the feedback for a specific order' })
  @ApiResponse({ status: 200, description: 'Feedback successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.feedbackService.findByOrder(orderId);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.CSKH)
  @ApiOperation({ summary: 'Approve a feedback' })
  @ApiResponse({ status: 200, description: 'Feedback successfully approved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.approve(id);
  }
}
