import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { Collection } from '../collections/entities/collection.entity';
import { Alert } from '../alerts/entities/alert.entity';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bin, Collection, Alert])],
  controllers: [BinsController],
  providers: [BinsService],
  exports: [BinsService],
})
export class BinsModule {}
