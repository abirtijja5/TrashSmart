import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());

  const isDev = config.get<string>('NODE_ENV') !== 'production';
  app.enableCors({
    origin: isDev
      ? (_origin: string, cb: (e: null, ok: boolean) => void) => cb(null, true)
      : config.get<string>('FRONTEND_URL', 'http://localhost:4200'),
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`TrashSmart API démarrée sur http://localhost:${port}/api`);
}

bootstrap();
