import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { ILogger } from '@domain/logger/logger.interface';
import { UserRepository } from '@domain/repositories/user-repository.interface';

export class deleteUserUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(id: UserAggregate['id']): Promise<void> {
        // Payload validation
        if (!id) throw new Error('User id is not defined');

        // Delete user
        await this.userRepository.delete(id);
        this.logger.log('deleteUserUseCases execute', 'User have been deleted');
    }
}
