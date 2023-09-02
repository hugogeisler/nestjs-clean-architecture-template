import { User } from '@infrastructure/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseUserRepository } from './user.repository';
import { TypeOrmConfigModule } from '@infrastructure/config/typeorm-config/typeorm-config.module';

@Module({
    imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User])],
    providers: [DatabaseUserRepository],
    exports: [DatabaseUserRepository],
})
export class RepositoriesModule {}
