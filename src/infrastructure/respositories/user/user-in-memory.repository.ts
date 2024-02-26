import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { UserRepository } from '@domain/repositories/user-repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
    private users: UserAggregate[] = [];

    async updateRefreshToken(
        email: string,
        refreshToken: string,
    ): Promise<void> {
        const user = this.users.find((user) => user.email === email);
        user.hash_refresh_token = refreshToken;

        const index = this.users.findIndex((user) => user.email === email);
        this.users[index] = user;
    }

    async getUserByEmail(email: string): Promise<UserAggregate> {
        const user = this.users.find((user) => user.email === email);
        if (!user) return null;
        return user;
    }

    async updateLastLogin(email: string): Promise<void> {
        const user = this.users.find((user) => user.email === email);
        user.lastLogin = new Date();

        const index = this.users.findIndex((user) => user.email === email);
        this.users[index] = user;
    }

    async insert(user: UserAggregate): Promise<UserAggregate> {
        this.users.push(user);
        return user;
    }

    async update(
        id: UserAggregate['id'],
        user: Partial<UserAggregate>,
    ): Promise<void> {
        const index = this.users.findIndex((user) => user.id === id);
        const updatedUser = new UserAggregate({
            ...this.users[index],
            ...user,
        });
        this.users[index] = updatedUser;
    }

    async delete(id: UserAggregate['id']): Promise<void> {
        const index = this.users.findIndex((user) => user.id === id);
        this.users.splice(index, 1);
    }

    async get(id: UserAggregate['id']): Promise<UserAggregate> {
        const user = this.users.find((user) => user.id === id);
        if (!user) return null;

        return user;
    }

    async getAll(): Promise<UserAggregate[]> {
        return this.users;
    }
}
