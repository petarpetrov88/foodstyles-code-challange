import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

export const LOGGER = 'logger';
export const loggerFactory = {
  provide: LOGGER,
  useFactory: (configService: ConfigService, parentClass: object) => {
    const config = configService.get('logger');
    return winston.createLogger({
      ...config,
      defaultMeta: {
        ...config.defaultMeta,
        context: parentClass?.constructor?.name,
      },
    });
  },
  scope: Scope.TRANSIENT,
  inject: [ConfigService, INQUIRER],
};
