import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Post, UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('collections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('weekly')
  getWeeklyData() {
    return this.service.getWeeklyData();
  }

  @Get('by-type')
  getTotalByType() {
    return this.service.getTotalByType();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@Body() dto: CreateCollectionDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
