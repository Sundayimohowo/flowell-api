import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
//
import { AppModule } from './app.module';
import { config } from './config';
import { ErrorInterceptor } from './interceptors/errors.interceptor';
import { Logger } from './utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  app.useGlobalInterceptors(new ErrorInterceptor());

  // logger
  app.useLogger(new Logger());
  await app.listen(config.port);
}

bootstrap();
