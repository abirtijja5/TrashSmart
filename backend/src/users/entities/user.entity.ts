import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN    = 'admin',
  OPERATOR = 'operator',
  VIEWER   = 'viewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: UserRole.VIEWER })
  role: UserRole;

  @Column({ nullable: true, select: false, name: 'refresh_token' })
  refreshToken: string | null;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
}
