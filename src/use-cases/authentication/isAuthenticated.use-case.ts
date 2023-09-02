import { UserRepository } from '@domain/repositories/user-repository.interface';
import { UserModel, UserWithoutPassword } from '@domain/models/user.model';

export class IsAuthenticatedUseCases {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(email: string): Promise<UserWithoutPassword> {
        const user: UserModel = await this.userRepository.getUserByEmail(email);
        const { password, ...info } = user;
        return info;
    }
}
