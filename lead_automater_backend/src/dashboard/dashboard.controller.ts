import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(Role.ADMIN)
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-activities')
  @Roles(Role.ADMIN)
  getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }

  // Route accessible by all authenticated users
  @Get('user-summary')
  @Roles(Role.ADMIN, Role.USER)
  getUserSummary(@Request() req) {
    return this.dashboardService.getUserSummary(req.user.userId);
  }
}
