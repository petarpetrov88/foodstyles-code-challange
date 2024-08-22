import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SearchRepository } from './search.repository';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [SearchService, SearchRepository],
  controllers: [SearchController],
})
export class SearchModule {}
