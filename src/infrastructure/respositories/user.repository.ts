import { UserModel } from '@domain/models/user.model';
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
    async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
        await this.userEntityRepository.update(
            {
                email,
            },
            { hach_refresh_token: refreshToken },
        );
    }
    async getUserByEmail(email: string): Promise<UserModel> {
        const adminUserEntity = await this.userEntityRepository.findOne({
            where: {
                email,
            },
        });
        if (!adminUserEntity) {
            return null;
        }
        return this.toUser(adminUserEntity);
    }
    async updateLastLogin(email: string): Promise<void> {
        await this.userEntityRepository.update(
            {
                email,
            },
            { last_login: () => 'CURRENT_TIMESTAMP' },
        );
    }

    private toUser(adminUserEntity: User): UserModel {
        const adminUser: UserModel = new UserModel();

        adminUser.id = adminUserEntity.id;
        adminUser.email = adminUserEntity.email;
        adminUser.password = adminUserEntity.password;
        adminUser.created_at = adminUserEntity.created_at;
        adminUser.updated_at = adminUserEntity.updated_at;
        adminUser.lastLogin = adminUserEntity.last_login;
        adminUser.hashRefreshToken = adminUserEntity.hach_refresh_token;

        return adminUser;
    }

    private toUserEntity(adminUser: UserModel): User {
        const adminUserEntity: User = new User();

        adminUserEntity.email = adminUser.email;
        adminUserEntity.password = adminUser.password;
        adminUserEntity.last_login = adminUser.lastLogin;

        return adminUserEntity;
    }
}
