import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BinsService } from './bins.service';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';

@Controller('bins')
@UseGuards(JwtAuthGuard)
export class BinsController {
  constructor(private binsService: BinsService) {}

  @Get()
  findAll() { return this.binsService.findAll(); }

  @Get('stats')
  getStats() { return this.binsService.getStats(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.binsService.findOne(id); }

  @Post()
  create(@Body() dto: CreateBinDto) { return this.binsService.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBinDto) { return this.binsService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.binsService.remove(id); }
}
