import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { ILogger } from '@domain/logger/logger.interface';
import { UserRepository } from '@domain/repositories/user-repository.interface';
import { Context } from '@domain/context/context.interface';

export class getUserUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        context: Context,
        id: UserAggregate['id'],
    ): Promise<UserAggregate> {
        // Payload validation
        if (!id) throw new Error('User id is not defined');

        const result = await this.userRepository.get(id);
        this.logger.log('getUserUseCases execute', 'User have been retrieved');
        return result;
    }
}
