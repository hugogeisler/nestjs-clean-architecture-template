import { ILogger } from '@domain/logger/logger.interface';
import { ICryptService } from '@domain/adapters/crypt.interface';
import { UnauthorizedException } from '@nestjs/common';
import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { UserRepository } from '@domain/repositories/user-repository.interface';
import { IUUID } from '@domain/adapters/uuid.interface';

type AddUserPayload = {
    email: string;
    password: string;
};

export class addUserUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly userRepository: UserRepository,
        private readonly cryptService: ICryptService,
        private readonly uuidService: IUUID,
    ) {}

    async execute(payload: AddUserPayload): Promise<UserAggregate> {
        // Check if user already exists
        if (await this.userRepository.getUserByEmail(payload.email))
            throw new UnauthorizedException('User already exists');

        // Create user
        const user = new UserAggregate({
            id: this.uuidService.generate(),
            email: payload.email,
            password: await this.cryptService.hash(payload.password),
            lastLogin: new Date(),
            hash_refresh_token: '',
            role: 'USER',
        });

        // Validate user
        user.validate();

        // Insert user
        const result = await this.userRepository.insert(user);
        this.logger.log('AddUserUseCases execute', 'User have been inserted');
        return result;
    }
}
