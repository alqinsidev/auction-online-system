// config/ormconfig-migration.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import * as path from 'path';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    path.join(`${__dirname}`, `../modules/**/entities/**.entity{.ts,.js}`),
  ],
  migrations: [path.resolve(`${__dirname}/../db/migrations/*{.ts,.js}`)],
  migrationsTableName: 'migrations',
  logging: false,
  synchronize: false,
};
export default config;
