import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDiet1724248422863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'diet',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
        ],
        indices: [
          new TableIndex({
            name: 'diet_name_idx',
            columnNames: ['name'],
            isUnique: true,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(new Table({ name: 'diet' }), true);
  }
}
