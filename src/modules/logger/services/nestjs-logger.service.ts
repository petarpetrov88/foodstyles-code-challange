import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NestJSLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get('logger');
    this.logger = winston.createLogger({
      ...config,
      defaultMeta: {
        ...config.defaultMeta,
        layer: 'Nest',
      },
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.customLog('info', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.customLog('error', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.customLog('warn', message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.customLog('debug', message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.customLog('verbose', message, ...optionalParams);
  }

  private customLog(
    level: 'info' | 'error' | 'warn' | 'debug' | 'verbose',
    message: any,
    ...optionalParams: any[]
  ) {
    this.logger[level](
      message,
      this.extractMeta(optionalParams, level === 'error'),
    );
  }

  private extractMeta(optionalParams: any[], isError = false): any {
    const meta: any = {};
    if (!optionalParams) {
      return undefined;
    }
    const context = optionalParams.pop();
    if (context) {
      meta.context = context;
    }
    if (isError) {
      const stack = optionalParams.pop();
      if (stack) {
        meta.stack = stack;
      }
    }

    return Object.keys(meta).length ? meta : undefined;
  }
}
