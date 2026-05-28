import {
  Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum WasteType {
  PLASTIQUE = 'plastique',
  VERRE     = 'verre',
  PAPIER    = 'papier',
  METAL     = 'metal',
  ORGANIQUE = 'organique',
}

export enum BinStatus {
  NORMAL   = 'normal',
  WARNING  = 'warning',
  CRITICAL = 'critical',
}

@Entity('bins')
export class Bin {
  @PrimaryColumn()
  id: string;

  @Column()
  location: string;

  @Column({ type: 'text', default: WasteType.PLASTIQUE })
  type: WasteType;

  @Column({ type: 'float', default: 0 })
  fillLevel: number;

  @Column({ type: 'text', default: BinStatus.NORMAL })
  status: BinStatus;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastUpdate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
