import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { ILogger } from '@domain/logger/logger.interface';
import { UserRepository } from '@domain/repositories/user-repository.interface';

export class getAllUsersUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(): Promise<UserAggregate[]> {
        // Get all users
        const result = await this.userRepository.getAll();
        this.logger.log(
            'getAllUsersUseCases execute',
            'All users have been retrieved',
        );
        return result;
    }
}
