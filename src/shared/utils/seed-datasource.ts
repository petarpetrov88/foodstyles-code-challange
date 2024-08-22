import { DataSource } from 'typeorm';
import config from '../../config';

export const connectionSource = new DataSource({
  ...config().typeorm,
  ...{
    migrationsTableName: 'seed',
    migrations: [__dirname + '/../../../seed/*-*.ts'],
    cli: {
      migrationDir: '../../../seed/migration/*-*.ts',
    },
  },
});
