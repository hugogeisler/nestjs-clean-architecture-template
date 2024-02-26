import { ApiProperty } from '@nestjs/swagger';

export class IsAuthPresenter {
    @ApiProperty()
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}
