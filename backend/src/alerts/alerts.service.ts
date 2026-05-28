import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
    if (!alert) throw new NotFoundException(`Alert ${id} not found`);
    return alert;
  }

  async create(dto: CreateAlertDto): Promise<Alert> {
    const alert = this.repo.create(dto);
    return this.repo.save(alert);
  }

  async acknowledge(id: number, name?: string): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.acknowledgedAt = new Date();
    if (name) alert.acknowledgedBy = name;
    return this.repo.save(alert);
  }

  async remove(id: number): Promise<void> {
    const alert = await this.findOne(id);
    await this.repo.remove(alert);
  }

  async getCount(): Promise<{ total: number; active: number; critical: number; warning: number }> {
    const all = await this.repo.find();
    const active = all.filter(a => !a.acknowledgedAt).length;
    const critical = all.filter(a => a.severity === 'critical' && !a.acknowledgedAt).length;
    const warning = all.filter(a => a.severity === 'warning' && !a.acknowledgedAt).length;
    return { total: all.length, active, critical, warning };
  }
}
