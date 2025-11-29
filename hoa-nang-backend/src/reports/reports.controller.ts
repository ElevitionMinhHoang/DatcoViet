import { Controller, Get, UseGuards, Query } from '@nestjs/common';
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

  @Get('revenue/daily')
  @ApiOperation({ summary: 'Get revenue data by day for charts' })
  @ApiResponse({ status: 200, description: 'Revenue by day data successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getRevenueByDay() {
    return this.reportsService.getRevenueByDay();
  }

  @Get('orders/status')
  @ApiOperation({ summary: 'Get orders count by status for charts' })
  @ApiResponse({ status: 200, description: 'Orders by status data successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getOrdersByStatus() {
    return this.reportsService.getOrdersByStatus();
  }

  @Get('summary/range')
  @ApiOperation({ summary: 'Get summary report for date range' })
  @ApiResponse({ status: 200, description: 'Summary report for date range successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getSummaryByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportsService.getSummaryByDateRange(startDate, endDate);
  }

  @Get('revenue/daily/range')
  @ApiOperation({ summary: 'Get revenue data by day for date range' })
  @ApiResponse({ status: 200, description: 'Revenue by day data for date range successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getRevenueByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportsService.getRevenueByDateRange(startDate, endDate);
  }

  @Get('orders/status/range')
  @ApiOperation({ summary: 'Get orders count by status for date range' })
  @ApiResponse({ status: 200, description: 'Orders by status data for date range successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getOrdersByStatusByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportsService.getOrdersByStatusByDateRange(startDate, endDate);
  }

  @Get('menu/top-selling/range')
  @ApiOperation({ summary: 'Get top selling menu items for date range' })
  @ApiResponse({ status: 200, description: 'Top selling menu items for date range successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getTopSellingMenuItemsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportsService.getTopSellingMenuItemsByDateRange(startDate, endDate);
  }
}
