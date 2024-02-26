import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { UserRepository } from '@domain/repositories/user-repository.interface';
import { User } from '@infrastructure/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseUserRepository implements UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userEntityRepository: Repository<User>,
    ) {}

    async updateRefreshToken(
        email: string,
        refreshToken: string,
    ): Promise<void> {
        await this.userEntityRepository.update(
            {
                email,
            },
            { hash_refresh_token: refreshToken },
        );
    }

    async getUserByEmail(email: string): Promise<UserAggregate> {
        const userEntity = await this.userEntityRepository.findOne({
            where: {
                email,
            },
        });
        if (!userEntity) return null;
        return this.toUser(userEntity);
    }

    async updateLastLogin(email: string): Promise<void> {
        await this.userEntityRepository.update(
            { email },
            { last_login: new Date() },
        );
    }

    async insert(user: UserAggregate): Promise<UserAggregate> {
        const userEntity = this.toUserEntity(user);
        const result = await this.userEntityRepository.insert(userEntity);
        return this.toUser(result.generatedMaps[0] as User);
    }

    async update(id: UserAggregate['id'], user: UserAggregate): Promise<void> {
        await this.userEntityRepository.update(
            {
                id,
            },
            user,
        );
    }

    async delete(id: UserAggregate['id']): Promise<void> {
        await this.userEntityRepository.delete(id);
    }

    async get(id: UserAggregate['id']): Promise<UserAggregate> {
        const userEntity = await this.userEntityRepository.findOne({
            where: {
                id,
            },
        });
        if (!userEntity) return null;
        return this.toUser(userEntity);
    }

    async getAll(): Promise<UserAggregate[]> {
        const userEntities = await this.userEntityRepository.find();
        return userEntities.map((userEntity) => this.toUser(userEntity));
    }

    private toUser(userEntity: User): UserAggregate {
        return new UserAggregate({
            id: userEntity.id,
            email: userEntity.email,
            password: userEntity.password,
            role: userEntity.role,
            lastLogin: userEntity.last_login,
            hash_refresh_token: userEntity.hash_refresh_token,
        });
    }

    private toUserEntity(user: UserAggregate): User {
        const userEntity: User = new User();

        userEntity.id = user.id;
        userEntity.email = user.email;
        userEntity.password = user.password;

        userEntity.last_login = user.lastLogin;
        userEntity.hash_refresh_token = user.hash_refresh_token;

        return userEntity;
    }
}
