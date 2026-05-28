import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bin, BinStatus } from './entities/bin.entity';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';

@Injectable()
export class BinsService {
  constructor(@InjectRepository(Bin) private repo: Repository<Bin>) {}

  findAll(): Promise<Bin[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: string): Promise<Bin> {
    const bin = await this.repo.findOne({ where: { id } });
    if (!bin) throw new NotFoundException(`Bin ${id} not found`);
    return bin;
  }

  async create(dto: CreateBinDto): Promise<Bin> {
    const bin = this.repo.create({ ...dto, status: this.computeStatus(dto.fillLevel ?? 0) });
    return this.repo.save(bin);
  }

  async update(id: string, dto: UpdateBinDto): Promise<Bin> {
    const bin = await this.findOne(id);
    Object.assign(bin, dto);
    if (dto.fillLevel !== undefined) {
      bin.status = this.computeStatus(dto.fillLevel);
    }
    bin.lastUpdate = new Date();
    return this.repo.save(bin);
  }

  async remove(id: string): Promise<void> {
    const bin = await this.findOne(id);
    await this.repo.remove(bin);
  }

  async getStats() {
    const bins = await this.repo.find();
    const active = bins.filter(b => b.isActive).length;
    const full = bins.filter(b => b.status === BinStatus.CRITICAL).length;
    const warning = bins.filter(b => b.status === BinStatus.WARNING).length;
    return { total: bins.length, active, full, warning };
  }

  private computeStatus(fillLevel: number): BinStatus {
    if (fillLevel >= 90) return BinStatus.CRITICAL;
    if (fillLevel >= 70) return BinStatus.WARNING;
    return BinStatus.NORMAL;
  }
}
