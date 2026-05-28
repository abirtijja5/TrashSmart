import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() { return this.analyticsService.getDashboardStats(); }

  @Get('efficiency')
  getEfficiency(@Query('days') days?: string) {
    return this.analyticsService.getEfficiencyTrend(days ? parseInt(days, 10) : 30);
  }
}
