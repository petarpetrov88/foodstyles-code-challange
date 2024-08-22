import { DataSource } from 'typeorm';
import config from '../../config';

export const connectionSource = new DataSource(config().typeorm);
