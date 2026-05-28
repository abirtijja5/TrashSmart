import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';
import { WasteType } from '../../bins/entities/bin.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bin_id' })
  binId: string;

  @Column({ type: 'text' })
  wasteType: WasteType;

  @Column({ type: 'float', name: 'weight_kg' })
  weightKg: number;

  @Column({ nullable: true, name: 'collected_by' })
  collectedBy: string | null;

  @Column({ nullable: true })
  notes: string | null;

  @Column({ type: 'datetime', name: 'collected_at' })
  collectedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
