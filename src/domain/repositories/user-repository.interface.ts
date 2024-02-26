import { UserAggregate } from '@domain/aggregates/user.aggregate';

export interface UserRepository {
    // C.R.U.D
    insert(user: UserAggregate): Promise<UserAggregate>;
    update(id: UserAggregate['id'], user: UserAggregate): Promise<void>;
    delete(id: UserAggregate['id']): Promise<void>;
    get(id: UserAggregate['id']): Promise<UserAggregate>;
    getAll(): Promise<UserAggregate[]>;

    // Extra
    getUserByEmail(email: string): Promise<UserAggregate>;
    updateLastLogin(email: string): Promise<void>;
    updateRefreshToken(email: string, refreshToken: string): Promise<void>;
}
