import { UserRole } from '@domain/aggregates/user.aggregate';

export interface IJwtServicePayload {
    user_id: string;
    email: string;
    role: UserRole;
}

export interface IJwtService {
    checkToken(token: string): Promise<any>;
    createToken(
        payload: IJwtServicePayload,
        secret: string,
        expiresIn: string,
    ): string;
}
