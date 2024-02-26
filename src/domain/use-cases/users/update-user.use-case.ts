import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { ILogger } from '@domain/logger/logger.interface';
import { UserRepository } from '@domain/repositories/user-repository.interface';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Context } from '@domain/context/context.interface';

type UpadteUserPayload = {
    email: string;
};

export class updateUserUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        context: Context,
        id: UserAggregate['id'],
        payload: UpadteUserPayload,
    ): Promise<void> {
        // Check if user exists
        const currentUser = await this.userRepository.get(id);
        if (!currentUser) throw new NotFoundException(`User ${id} not found`);

        // Update user data
        const updatedUser = new UserAggregate({
            ...currentUser,
            email: payload.email,
        });

        // Validate user
        updatedUser.validate();

        await this.userRepository.update(id, updatedUser);
        this.logger.log(
            'updateUserUseCases execute',
            `User ${id} have been updated`,
        );
    }
}
