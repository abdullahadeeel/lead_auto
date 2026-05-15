import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrackActivityDto } from './dto/track-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  track(@Request() req, @Body() dto: TrackActivityDto) {
    return this.analyticsService.trackActivity(req.user.userId, dto);
  }

  @Get('recommendations')
  getRecommendations(@Request() req) {
    return this.analyticsService.getRecommendations(req.user.userId);
  }
}
