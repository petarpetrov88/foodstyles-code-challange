import { Controller, Get, Query } from '@nestjs/common';

import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/searchQuery.dto';
import { SearchResultDto } from './dto/searchResult.dto';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiQuery({ name: 'q', type: 'string', required: true })
  @ApiOkResponse({
    description: 'Search results',
    type: SearchResultDto,
    isArray: true,
  })
  @Get()
  async search(@Query() query: SearchQueryDto): Promise<SearchResultDto[]> {
    const { q } = query;
    return this.searchService.find(q);
  }
}
