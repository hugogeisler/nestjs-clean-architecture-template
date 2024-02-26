import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

switch (process.env.NODE_ENV) {
    case 'debug':
        dotenv.config({ path: './env/debug.env' });
        break;
    case 'development':
        dotenv.config({ path: './env/development.env' });
        break;
    case 'production':
        dotenv.config({ path: './env/production.env' });
        break;
    default:
        throw new Error('No environment specified');
}

export const TypeOrmConfig: TypeOrmModuleOptions = {
    type: 'mongodb',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../../**/*.entity.{js,ts}'],
    synchronize: process.env.NODE_ENV !== 'production',
    useUnifiedTopology: true,
    autoLoadEntities: true,
};
