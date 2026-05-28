import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  findAll() { return this.alertsService.findAll(); }

  @Get('active')
  findActive() { return this.alertsService.findActive(); }

  @Get('count')
  getCount() { return this.alertsService.getCount(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.alertsService.findOne(id); }

  @Post()
  create(@Body() dto: CreateAlertDto) { return this.alertsService.create(dto); }

  @Patch(':id/acknowledge')
  acknowledge(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.alertsService.acknowledge(id, user?.name);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.alertsService.remove(id); }
}
