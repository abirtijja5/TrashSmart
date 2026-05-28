import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (!bin) throw new NotFoundException(`Poubelle ${id} introuvable`);
    return bin;
  }

  async create(dto: CreateBinDto): Promise<Bin> {
    const exists = await this.repo.findOne({ where: { id: dto.id } });
    if (exists) throw new ConflictException(`L'identifiant ${dto.id} est déjà utilisé`);
    const bin = this.repo.create({ ...dto, lastUpdate: new Date() });
    return this.repo.save(bin);
  }

  async update(id: string, dto: UpdateBinDto): Promise<Bin> {
    const bin = await this.findOne(id);
    Object.assign(bin, dto, { lastUpdate: new Date() });
    this.recomputeStatus(bin);
    return this.repo.save(bin);
  }

  async remove(id: string): Promise<void> {
    const bin = await this.findOne(id);
    await this.repo.remove(bin);
  }

  async getStats() {
    const bins = await this.repo.find();
    return {
      total:    bins.length,
      active:   bins.filter(b => b.isActive).length,
      full:     bins.filter(b => b.fillLevel >= 90).length,
      warning:  bins.filter(b => b.status === BinStatus.WARNING).length,
      critical: bins.filter(b => b.status === BinStatus.CRITICAL).length,
    };
  }

  private recomputeStatus(bin: Bin) {
    if (bin.fillLevel >= 90)      bin.status = BinStatus.CRITICAL;
    else if (bin.fillLevel >= 70) bin.status = BinStatus.WARNING;
    else                          bin.status = BinStatus.NORMAL;
  }
}
