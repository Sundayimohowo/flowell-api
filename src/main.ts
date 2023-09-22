import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
//
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  await app.listen(config.PORT);
}

bootstrap();
