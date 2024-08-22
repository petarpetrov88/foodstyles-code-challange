import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDish1724248422864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dish_type',
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
            name: 'dish_type_name_idx',
            columnNames: ['name'],
            isUnique: true,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(new Table({ name: 'dish_type' }), true);
  }
}
