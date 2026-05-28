import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../collections/entities/collection.entity';
import { Bin, BinStatus } from '../bins/entities/bin.entity';
import { Alert } from '../alerts/entities/alert.entity';
import { IsNull } from 'typeorm';

const WASTE_COLORS: Record<string, string> = {
  plastique: '#4B9EF5',
  verre:     '#1D9E75',
  papier:    '#F5A623',
  metal:     '#9B59B6',
  organique: '#E87E4D',
};

const WASTE_ICONS: Record<string, string> = {
  plastique: 'fa-bottle-water',
  verre:     'fa-wine-bottle',
  papier:    'fa-newspaper',
  metal:     'fa-wrench',
  organique: 'fa-seedling',
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Collection) private collectionsRepo: Repository<Collection>,
    @InjectRepository(Bin)        private binsRepo: Repository<Bin>,
    @InjectRepository(Alert)      private alertsRepo: Repository<Alert>,
  ) {}

  async getDashboardStats() {
    const collections = await this.collectionsRepo.find();
    const bins = await this.binsRepo.find();
    const alerts = await this.alertsRepo.find({ where: { acknowledgedAt: IsNull() } });

    const totalCollected = collections.reduce((s, c) => s + (c.weightKg || 0), 0);
    const activeBins = bins.filter(b => b.isActive).length;
    const fullBins = bins.filter(b => b.status === BinStatus.CRITICAL).length;
    const alertsCount = alerts.length;
    const co2Saved = totalCollected * 0.8;

    // Waste types aggregation
    const typeMap: Record<string, number> = {};
    for (const c of collections) {
      const t = (c.wasteType || 'autre').toLowerCase();
      typeMap[t] = (typeMap[t] || 0) + (c.weightKg || 0);
    }

    const wasteTypes = Object.entries(typeMap).map(([type, kg]) => ({
      type,
      kg: Math.round(kg * 10) / 10,
      percent: totalCollected > 0 ? Math.round((kg / totalCollected) * 1000) / 10 : 0,
      color: WASTE_COLORS[type] || '#AAAAAA',
      icon: WASTE_ICONS[type] || 'fa-trash',
    })).sort((a, b) => b.kg - a.kg);

    // Sorting efficiency: non-organic ratio
    const organicKg = typeMap['organique'] || 0;
    const sortingEfficiency = totalCollected > 0
      ? Math.round(((totalCollected - organicKg) / totalCollected) * 1000) / 10
      : 0;

    return { totalCollected, sortingEfficiency, activeBins, fullBins, alertsCount, co2Saved, wasteTypes };
  }

  async getEfficiencyTrend(days = 30): Promise<{ date: string; efficiency: number }[]> {
    const result: { date: string; efficiency: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);

      const cols = await this.collectionsRepo
        .createQueryBuilder('c')
        .where('c.collectedAt >= :start AND c.collectedAt <= :end', { start, end })
        .getMany();

      const total = cols.reduce((s, c) => s + (c.weightKg || 0), 0);
      const organic = cols.filter(c => c.wasteType?.toLowerCase() === 'organique')
                          .reduce((s, c) => s + (c.weightKg || 0), 0);

      const efficiency = total > 0 ? Math.round(((total - organic) / total) * 1000) / 10 : 0;

      result.push({ date: start.toISOString(), efficiency });
    }

    return result;
  }
}
