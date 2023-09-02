import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: './env/local.env' });
}

export const TypeOrmConfig: TypeOrmModuleOptions = {
    type: 'mongodb',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    synchronize: false,
    useUnifiedTopology: true,
};
