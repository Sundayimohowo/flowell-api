import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
//
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  await app.listen(5000);
}

bootstrap();
