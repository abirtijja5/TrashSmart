import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(@InjectRepository(Alert) private repo: Repository<Alert>) {}

  findAll(): Promise<Alert[]> {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  findActive(): Promise<Alert[]> {
    return this.repo.find({
      where: { acknowledgedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Alert> {
    const alert = await this.repo.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Alerte ${id} introuvable`);
    return alert;
  }

  create(dto: CreateAlertDto): Promise<Alert> {
    return this.repo.save(this.repo.create(dto));
  }

  async acknowledge(id: number, acknowledgedBy: string): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;
    return this.repo.save(alert);
  }

  async remove(id: number): Promise<void> {
    const alert = await this.findOne(id);
    await this.repo.remove(alert);
  }

  async getCount(): Promise<{ total: number; active: number; critical: number }> {
    const [total, active, critical] = await Promise.all([
      this.repo.count(),
      this.repo.count({ where: { acknowledgedAt: IsNull() } }),
      this.repo.count({ where: { severity: 'critical' as any, acknowledgedAt: IsNull() } }),
    ]);
    return { total, active, critical };
  }
}
