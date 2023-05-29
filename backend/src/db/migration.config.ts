// config/ormconfig-migration.ts
import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';
const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    path.join(`${__dirname}`, `../modules/**/entities/**.entity{.ts,.js}`),
  ],
  migrations: [path.join(`${__dirname}`, `../db/migrations/*{.ts,.js}`)],
  migrationsTableName: 'migrations',
  logging: true,
  synchronize: false,
});
export default config;
