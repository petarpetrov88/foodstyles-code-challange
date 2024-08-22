import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { LoggerModule } from '../logger/logger.module';
import { LOGGER } from '../logger/factories/logger.factory';
import config from '../../config';

import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.get('typeorm');
        return config;
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    SearchModule,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(LOGGER) private logger: Logger) {}

  onApplicationBootstrap(): any {
    this.logger.info('Application bootstrap success!', {
      type: 'APP_BOOTSTRAP',
    });
  }
}
