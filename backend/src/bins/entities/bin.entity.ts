import {
  Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum WasteType {
  PLASTIQUE  = 'plastique',
  VERRE      = 'verre',
  PAPIER     = 'papier',
  METAL      = 'metal',
  ORGANIQUE  = 'organique',
  AUTRE      = 'autre',
}

export enum BinStatus {
  NORMAL   = 'normal',
  WARNING  = 'warning',
  CRITICAL = 'critical',
}

@Entity('bins')
export class Bin {
  @PrimaryColumn({ length: 20 })
  id: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  type: WasteType;

  @Column({ type: 'float', default: 0, name: 'fill_level' })
  fillLevel: number;

  @Column({ type: 'text', default: BinStatus.NORMAL })
  status: BinStatus;

  @Column({ type: 'float', nullable: true })
  latitude: number | null;

  @Column({ type: 'float', nullable: true })
  longitude: number | null;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true, name: 'last_update' })
  lastUpdate: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
