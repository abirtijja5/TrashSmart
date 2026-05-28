import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Bin } from '../../bins/entities/bin.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  binId: string;

  @ManyToOne(() => Bin, { onDelete: 'SET NULL', nullable: true, eager: false })
  @JoinColumn({ name: 'binId' })
  bin: Bin;

  @Column()
  wasteType: string;

  @Column({ type: 'float' })
  weightKg: number;

  @Column({ nullable: true })
  collectedBy: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  collectedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
