import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(@InjectRepository(Collection) private repo: Repository<Collection>) {}

  findAll(): Promise<Collection[]> {
    return this.repo.find({
      order: { collectedAt: 'DESC' },
      take: 200,
    });
  }

  async findOne(id: string): Promise<Collection> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Collection ${id} not found`);
    return c;
  }

  async create(dto: CreateCollectionDto): Promise<Collection> {
    const col = this.repo.create({
      ...dto,
      collectedAt: dto.collectedAt ? new Date(dto.collectedAt) : new Date(),
    });
    return this.repo.save(col);
  }

  async remove(id: string): Promise<void> {
    const c = await this.findOne(id);
    await this.repo.remove(c);
  }

  async getWeeklyData(): Promise<any[]> {
    const days: any[] = [];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const wasteTypes = ['plastique', 'verre', 'papier', 'metal', 'organique'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);

      const entry: any = { day: dayNames[date.getDay()] };
      for (const wt of wasteTypes) {
        const rows = await this.repo
          .createQueryBuilder('c')
          .where('c.collectedAt >= :start AND c.collectedAt <= :end', { start, end })
          .andWhere('LOWER(c.wasteType) = :wt', { wt })
          .select('SUM(c.weightKg)', 'total')
          .getRawOne();
        entry[wt] = parseFloat(rows?.total ?? '0') || 0;
      }
      days.push(entry);
    }
    return days;
  }

  async getTotalByType(): Promise<any[]> {
    return this.repo
      .createQueryBuilder('c')
      .select('c.wasteType', 'type')
      .addSelect('SUM(c.weightKg)', 'totalKg')
      .groupBy('c.wasteType')
      .orderBy('totalKg', 'DESC')
      .getRawMany();
  }
}
