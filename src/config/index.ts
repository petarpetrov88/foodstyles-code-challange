import * as winston from 'winston';
import { errorStackFormatterInline } from '../modules/logger/utils/error-stack-formatter-inline.util';
import { prettyConsoleFormatter } from '../modules/logger/utils/pretty-console-formatter.util';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => {
  return {
    typeorm: {
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'foodstyles',
      logging: true,
      entities: ['../entities/*.entity.ts'],
      autoLoadEntities: true,
      synchronize: false,
      migrationsTableName: 'migration',
      migrations: [__dirname + '/../migration/*.ts'],
      cli: {
        migrationDir: '../migration/*.ts',
      },
    } as PostgresConnectionOptions,
    logger: {
      level: process.env.LOGGER_MIN_LEVEL || 'debug',
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        errorStackFormatterInline(),
        prettyConsoleFormatter(),
      ),
      defaultMeta: {
        layer: 'App',
        service: process.env.SERVICE_NAME,
        context: 'unspecified', // is overridden by the logger factory and the NestJSLoggerService
      },
    },
  };
};
