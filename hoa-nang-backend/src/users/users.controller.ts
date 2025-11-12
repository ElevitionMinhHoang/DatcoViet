import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({ status: 200, description: 'User profile successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Req() req: Request) {
    return this.usersService.findOne(req.user['userId']);
  }
}
