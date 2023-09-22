import { LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.json(),
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), format.simple()),
    }),
  );
} else {
  // logger.add(new transports.File({filename: 'combined.log'}))
}

export class Logger implements LoggerService {
  debug(message: any, ...optionalParams: any[]): any {
    logger.debug(message);
  }

  error(message: any, ...optionalParams: any[]): any {
    logger.error(message);
  }

  log(message: any, ...optionalParams: any[]): any {
    logger.info(message);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    logger.verbose(message);
  }

  warn(message: any, ...optionalParams: any[]): any {
    logger.warn(message);
  }
}
