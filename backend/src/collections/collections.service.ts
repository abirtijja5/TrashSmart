import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { WasteType } from '../bins/entities/bin.entity';

@Injectable()
export class CollectionsService {
  constructor(@InjectRepository(Collection) private repo: Repository<Collection>) {}

  findAll(): Promise<Collection[]> {
    return this.repo.find({ order: { collectedAt: 'DESC' }, take: 200 });
  }

  async findOne(id: string): Promise<Collection> {
    const col = await this.repo.findOne({ where: { id } });
    if (!col) throw new NotFoundException(`Collecte ${id} introuvable`);
    return col;
  }

  create(dto: CreateCollectionDto): Promise<Collection> {
    const col = this.repo.create({
      ...dto,
      collectedAt: dto.collectedAt ? new Date(dto.collectedAt) : new Date(),
    });
    return this.repo.save(col);
  }

  async remove(id: string): Promise<void> {
    const col = await this.findOne(id);
    await this.repo.remove(col);
  }

  async getWeeklyData() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const rows = await this.repo.find({
      where: { collectedAt: Between(start, now) },
    });

    const days: Record<string, Record<string, number>> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('fr-FR', { weekday: 'short' });
      days[key] = { plastique: 0, verre: 0, papier: 0, metal: 0, organique: 0, autre: 0 };
    }

    for (const row of rows) {
      const key = new Date(row.collectedAt).toLocaleDateString('fr-FR', { weekday: 'short' });
      if (days[key]) {
        days[key][row.wasteType] = (days[key][row.wasteType] || 0) + row.weightKg;
      }
    }

    return Object.entries(days).map(([day, data]) => ({ day, ...data }));
  }

  async getTotalByType() {
    const result = await this.repo
      .createQueryBuilder('c')
      .select('c.wasteType', 'type')
      .addSelect('SUM(c.weightKg)', 'totalKg')
      .groupBy('c.wasteType')
      .getRawMany();

    const total = result.reduce((s, r) => s + Number(r.totalKg), 0);
    const colors: Record<string, string> = {
      [WasteType.PLASTIQUE]: '#1D9E75',
      [WasteType.VERRE]:     '#378ADD',
      [WasteType.PAPIER]:    '#EF9F27',
      [WasteType.METAL]:     '#D4537E',
      [WasteType.ORGANIQUE]: '#639922',
      [WasteType.AUTRE]:     '#888780',
    };

    return result.map(r => ({
      type:    r.type,
      kg:      Math.round(Number(r.totalKg)),
      percent: total > 0 ? Math.round((r.totalKg / total) * 1000) / 10 : 0,
      color:   colors[r.type] ?? '#888780',
    }));
  }
}
