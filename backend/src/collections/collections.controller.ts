import {
  Controller, Get, Post, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private collectionsService: CollectionsService) {}

  @Get()
  findAll() { return this.collectionsService.findAll(); }

  @Get('weekly')
  getWeekly() { return this.collectionsService.getWeeklyData(); }

  @Get('by-type')
  getByType() { return this.collectionsService.getTotalByType(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.collectionsService.findOne(id); }

  @Post()
  create(@Body() dto: CreateCollectionDto) { return this.collectionsService.create(dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.collectionsService.remove(id); }
}
