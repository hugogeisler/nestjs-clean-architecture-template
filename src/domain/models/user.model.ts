export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export class UserWithoutPassword {
    id: string;
    email: string;
    roles: UserRole[];

    lastLogin: Date;
    hashRefreshToken: string;

    created_at: Date;
    updated_at: Date;
}

export class UserModel extends UserWithoutPassword {
    password: string;
}
