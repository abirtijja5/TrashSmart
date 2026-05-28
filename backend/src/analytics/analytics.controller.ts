import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboardStats();
  }

  @Get('efficiency')
  getEfficiency(@Query('days') days?: string) {
    return this.service.getEfficiencyTrend(days ? parseInt(days, 10) : 30);
  }
}
