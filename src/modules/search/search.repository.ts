import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SearchRepository {
  constructor(private readonly dataSource: DataSource) {}

  private buildSearchQuery() {
    return `
      SELECT *, 'brand' AS type FROM brand WHERE "name" ILIKE ANY ($1)
      UNION ALL
      SELECT *, 'city' AS type FROM city WHERE "name" ILIKE ANY ($1)
      UNION ALL
      SELECT *, 'diet' AS type FROM diet WHERE "name" ILIKE ANY ($1)
      UNION ALL
      SELECT *, 'dishType' AS type FROM dish_type WHERE "name" ILIKE ANY ($1);
    `;
  }

  public findByTerms(searchTerms: string[]) {
    const query = this.buildSearchQuery();
    return this.dataSource.query(query, [searchTerms]);
  }
}
