import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AlertSeverity {
  WARNING  = 'warning',
  CRITICAL = 'critical',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bin_id' })
  binId: string;

  @Column()
  message: string;

  @Column({ type: 'text' })
  severity: AlertSeverity;

  @Column()
  location: string;

  @Column({ nullable: true, name: 'acknowledged_at', type: 'datetime' })
  acknowledgedAt: Date | null;

  @Column({ nullable: true, name: 'acknowledged_by' })
  acknowledgedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
