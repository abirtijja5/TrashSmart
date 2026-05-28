import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { BinsService } from './bins.service';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('bins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BinsController {
  constructor(private service: BinsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@Body() dto: CreateBinDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  update(@Param('id') id: string, @Body() dto: UpdateBinDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
