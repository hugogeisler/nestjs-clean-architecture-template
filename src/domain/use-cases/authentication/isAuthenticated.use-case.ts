import { UserRepository } from '@domain/repositories/user-repository.interface';
import { UserAggregate } from '@domain/aggregates/user.aggregate';

export class IsAuthenticatedUseCases {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(
        email: string,
    ): Promise<
        Omit<UserAggregate, 'password' | 'validate' | 'validatePassword'>
    > {
        // Get user by email
        const user: UserAggregate = await this.userRepository.getUserByEmail(
            email,
        );

        // Remove password from user
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
