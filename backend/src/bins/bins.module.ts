import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bin])],
  controllers: [BinsController],
  providers: [BinsService],
  exports: [BinsService],
})
export class BinsModule {}
