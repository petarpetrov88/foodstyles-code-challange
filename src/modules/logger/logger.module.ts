import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NestJSLoggerService } from './services/nestjs-logger.service';
import { LOGGER, loggerFactory } from './factories/logger.factory';
import { LogHttp } from '../../middleware/log-http.middleware';

@Global()
@Module({
  imports: [],
  providers: [loggerFactory, NestJSLoggerService],
  exports: [LOGGER, NestJSLoggerService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LogHttp).forRoutes('*');
  }
}
