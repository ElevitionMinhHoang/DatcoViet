import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get a summary report' })
  @ApiResponse({ status: 200, description: 'Summary report successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getSummary() {
    return this.reportsService.getSummary();
  }

  @Get('menu/top-selling')
  @ApiOperation({ summary: 'Get a report of the top-selling menu items' })
  @ApiResponse({ status: 200, description: 'Top-selling menu items report successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getTopSellingMenuItems() {
    return this.reportsService.getTopSellingMenuItems();
  }

  @Get('customers/top')
  @ApiOperation({ summary: 'Get a report of the top customers' })
  @ApiResponse({ status: 200, description: 'Top customers report successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getTopCustomers() {
    return this.reportsService.getTopCustomers();
  }
}
