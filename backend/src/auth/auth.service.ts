import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

export interface TokenPair { accessToken: string; refreshToken: string; }

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!user || !user.isActive) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return user;
  }

  async login(user: User): Promise<TokenPair> {
    return this.generateTokens(user);
  }

  async register(dto: RegisterDto): Promise<TokenPair> {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');
    const user = this.usersRepo.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role: dto.role ?? UserRole.VIEWER,
    });
    const saved = await this.usersRepo.save(user);
    return this.generateTokens(saved);
  }

  async refresh(rawToken: string): Promise<TokenPair> {
    let payload: any;
    try {
      payload = this.jwtService.verify(rawToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'trashsmart_refresh_secret_dev'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id: payload.sub })
      .getOne();

    if (!user || !user.refreshToken || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const valid = await bcrypt.compare(rawToken, user.refreshToken);
    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    return this.generateTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepo.update(userId, { refreshToken: null });
  }

  async me(userId: string): Promise<User> {
    return this.usersRepo.findOne({ where: { id: userId } });
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET', 'trashsmart_jwt_secret_dev'),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET', 'trashsmart_refresh_secret_dev'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update(user.id, { refreshToken: hashed });

    return { accessToken, refreshToken };
  }
}
