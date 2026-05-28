import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlertsController {
  constructor(private service: AlertsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  findActive() {
    return this.service.findActive();
  }

  @Get('count')
  getCount() {
    return this.service.getCount();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@Body() dto: CreateAlertDto) {
    return this.service.create(dto);
  }

  @Patch(':id/acknowledge')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  acknowledge(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.service.acknowledge(id, user.name);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
