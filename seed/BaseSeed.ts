import { MigrationInterface } from 'typeorm';
import * as fs from 'fs';
import { QueryRunner } from 'typeorm';
import { parse } from 'csv-parse/sync';

export abstract class BaseSeed implements MigrationInterface {
  protected abstract file: string;
  protected abstract tableName: string;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedData = parse(fs.readFileSync(this.file), {
      delimiter: ',',
      from: 2,
    });

    seedData.forEach(async (data) => {
      await queryRunner.query(
        `INSERT INTO "${this.tableName}" (id,name) VALUES ($1,$2)`,
        [data[0], data[1]],
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE "${this.tableName}";`);
  }
}
