import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BinsModule } from './bins/bins.module';
import { CollectionsModule } from './collections/collections.module';
import { AlertsModule } from './alerts/alerts.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { User } from './users/entities/user.entity';
import { Bin } from './bins/entities/bin.entity';
import { Collection } from './collections/entities/collection.entity';
import { Alert } from './alerts/entities/alert.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<any>('DB_TYPE', 'sqlite'),
        database: config.get<string>('DB_DATABASE', 'trashsmart.db'),
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        entities: [User, Bin, Collection, Alert],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
    ]),

    AuthModule,
    UsersModule,
    BinsModule,
    CollectionsModule,
    AlertsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
