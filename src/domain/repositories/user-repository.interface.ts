import { UserModel } from '../models/user.model';

export interface UserRepository {
    getUserByEmail(email: string): Promise<UserModel>;
    updateLastLogin(email: string): Promise<void>;
    updateRefreshToken(email: string, refreshToken: string): Promise<void>;
}
