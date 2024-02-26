import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { ApiProperty } from '@nestjs/swagger';

export class UserPresenter {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    lastLogin: Date;

    @ApiProperty()
    hashRefreshToken: string;

    constructor(user: UserAggregate) {
        this.id = user.id;
        this.email = user.email;
        this.lastLogin = user.lastLogin;
        this.hashRefreshToken = user.hash_refresh_token;
    }
}
