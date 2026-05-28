import {
  ConflictException, Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email AND u.isActive = true', { email })
      .getOne();

    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async login(user: User): Promise<TokenPair> {
    return this.generateTokens(user);
  }

  async register(dto: RegisterDto): Promise<TokenPair> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Cet email est déjà utilisé');

    const user = this.userRepo.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role: dto.role ?? UserRole.VIEWER,
    });
    await this.userRepo.save(user);
    return this.generateTokens(user);
  }

  async refresh(rawRefreshToken: string): Promise<TokenPair> {
    let payload: any;
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.refreshToken')
      .where('u.id = :id AND u.isActive = true', { id: payload.sub })
      .getOne();

    if (!user?.refreshToken)
      throw new UnauthorizedException('Session expirée — veuillez vous reconnecter');

    const matches = await bcrypt.compare(rawRefreshToken, user.refreshToken);
    if (!matches) throw new UnauthorizedException('Refresh token invalide');

    return this.generateTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: null });
  }

  async me(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    const rawRefresh = uuidv4() + '.' + uuidv4();
    const refreshToken = this.jwtService.sign(
      { sub: user.id, jti: rawRefresh },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, { refreshToken: hashed });

    return { accessToken, refreshToken };
  }
}
