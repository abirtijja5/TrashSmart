import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../collections/entities/collection.entity';
import { Bin, BinStatus } from '../bins/entities/bin.entity';
import { Alert } from '../alerts/entities/alert.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Collection) private collectionsRepo: Repository<Collection>,
    @InjectRepository(Bin)        private binsRepo: Repository<Bin>,
    @InjectRepository(Alert)      private alertsRepo: Repository<Alert>,
  ) {}

  async getDashboardStats() {
    const [bins, alerts, wasteAgg] = await Promise.all([
      this.binsRepo.find(),
      this.alertsRepo.count({ where: { acknowledgedAt: IsNull() } }),
      this.collectionsRepo
        .createQueryBuilder('c')
        .select('SUM(c.weightKg)', 'total')
        .addSelect('c.wasteType', 'type')
        .groupBy('c.wasteType')
        .getRawMany(),
    ]);

    const activeBins  = bins.filter(b => b.isActive).length;
    const fullBins    = bins.filter(b => b.fillLevel >= 90).length;
    const totalKg     = wasteAgg.reduce((s, r) => s + Number(r.total), 0);
    const co2Saved    = Math.round(totalKg * 0.26);

    const sorted = bins.filter(b => b.status !== BinStatus.CRITICAL).length;
    const sortingEfficiency = activeBins > 0
      ? Math.round((sorted / activeBins) * 1000) / 10
      : 0;

    const colors: Record<string, string> = {
      plastique: '#1D9E75', verre: '#378ADD', papier: '#EF9F27',
      metal: '#D4537E', organique: '#639922', autre: '#888780',
    };

    const wasteTypes = wasteAgg.map(r => ({
      type:    r.type,
      kg:      Math.round(Number(r.total)),
      percent: totalKg > 0 ? Math.round((r.total / totalKg) * 1000) / 10 : 0,
      color:   colors[r.type] ?? '#888780',
      icon:    this.iconFor(r.type),
    }));

    return {
      totalCollected:    Math.round(totalKg),
      sortingEfficiency,
      activeBins,
      fullBins,
      alertsCount:       alerts,
      co2Saved,
      wasteTypes,
    };
  }

  async getEfficiencyTrend(days = 30) {
    const result = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const [total, collected] = await Promise.all([
        this.binsRepo.count({ where: { isActive: true } }),
        this.collectionsRepo
          .createQueryBuilder('c')
          .where('c.collectedAt BETWEEN :start AND :end', { start, end })
          .getCount(),
      ]);

      const efficiency = total > 0
        ? Math.min(100, Math.round((collected / Math.max(1, total * 0.1)) * 100 * 10) / 10)
        : 0;

      result.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        efficiency,
      });
    }
    return result;
  }

  private iconFor(type: string): string {
    const icons: Record<string, string> = {
      plastique: 'recycle', verre: 'droplet', papier: 'file-text',
      metal: 'tool', organique: 'leaf', autre: 'package',
    };
    return icons[type] ?? 'package';
  }
}
