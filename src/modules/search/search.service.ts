import { Injectable } from '@nestjs/common';
import * as hash from 'object-hash';
import { SearchRepository } from './search.repository';
import ignoredTerms from './constants/ignoredTerms';
import { SearchResultDto } from './dto/searchResult.dto';

@Injectable()
export class SearchService {
  constructor(private readonly repository: SearchRepository) {}

  private splitTerms(search: string) {
    return search
      .split(' ')
      .filter((term) => term !== '')
      .filter((term) => ignoredTerms.indexOf(term.toLowerCase()) === -1);
  }

  private formatTerms(searchTerms: string[]): string[] {
    return searchTerms.map((term) => `%${term}%`);
  }

  private findResultTerm(searchTerms: string[], item) {
    return searchTerms.find((term) =>
      item.name.toLowerCase().includes(term.toLowerCase()),
    );
  }

  private decorateData(results, searchTerms) {
    return results.reduce((accumulator, item) => {
      const { type, ...rest } = item;
      if (!accumulator[type]) {
        accumulator[type] = [];
      }
      accumulator[type].push({
        ...rest,
        term: this.findResultTerm(searchTerms, rest),
      });
      return accumulator;
    }, {});
  }

  private sanitizeResponse(results) {
    return results.map((item) => {
      const result = {};

      Object.keys(item).forEach((key) => {
        result[key] = { id: item[key].id, name: item[key].name };
      });

      return result;
    });
  }

  private generateResults(data) {
    const keys = Object.keys(data);

    const results = [];
    const resultHashes = [];
    for (const currentKey of keys) {
      const restKeys = Object.keys(data).filter((term) => term !== currentKey);

      const hasTermDuplicate = (data, property) => {
        const properties = Object.keys(data).filter(
          (key) => data[key].term === property.term,
        );

        return properties.length > 0;
      };

      const generateResult = (index, currentObject) => {
        if (index === restKeys.length) {
          const resultHash = hash(currentObject);
          if (!resultHashes.includes(resultHash)) {
            results.push(currentObject);
            resultHashes.push(resultHash);
          }
          return;
        }

        const key = restKeys[index];
        for (const value of data[key]) {
          if (!hasTermDuplicate(currentObject, value)) {
            currentObject[key] = value;
          }
        }

        generateResult(index + 1, currentObject);
      };

      if (data.hasOwnProperty(currentKey)) {
        for (const value of data[currentKey]) {
          const currentObject = { [currentKey]: value };
          generateResult(0, currentObject);
        }
      }
    }

    return this.sanitizeResponse(results);
  }

  public async find(search: string): Promise<SearchResultDto[]> {
    const searchWords = this.splitTerms(search);
    const searchTerms = this.formatTerms(searchWords);
    const entities = await this.repository.findByTerms(searchTerms);

    return this.generateResults(this.decorateData(entities, searchWords));
  }
}
