import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

export enum AlertSeverity {
  WARNING  = 'warning',
  CRITICAL = 'critical',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  binId: string;

  @Column()
  message: string;

  @Column({ type: 'text', default: AlertSeverity.WARNING })
  severity: AlertSeverity;

  @Column()
  location: string;

  @Column({ type: 'datetime', nullable: true })
  acknowledgedAt: Date;

  @Column({ nullable: true })
  acknowledgedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
