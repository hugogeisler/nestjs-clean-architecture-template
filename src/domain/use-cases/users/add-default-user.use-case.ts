import { ICryptService } from '@domain/adapters/crypt.interface';
import { IUUID } from '@domain/adapters/uuid.interface';
import { UserAggregate } from '@domain/aggregates/user.aggregate';
import { ILogger } from '@domain/logger/logger.interface';
import { UserRepository } from '@domain/repositories/user-repository.interface';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';

export class addDefaultUserUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly userRepository: UserRepository,
        private readonly cryptService: ICryptService,
        private readonly uuidService: IUUID,
        private readonly config: EnvironmentConfigService,
    ) {}

    async execute(): Promise<UserAggregate> {
        const email = this.config.getAdminEmail();
        const password = this.config.getAdminPassword();

        // Check if user already exists
        const defaultUser = await this.userRepository.getUserByEmail(email);
        if (defaultUser) {
            this.logger.log(
                'AddDefaultUser execute',
                'Default user already exists',
            );
            return defaultUser;
        }

        // Create user
        const user = new UserAggregate({
            id: this.uuidService.generate(),
            email: email,
            password: await this.cryptService.hash(password),
            lastLogin: new Date(),
            hash_refresh_token: '',
            role: 'ADMINISTRATOR',
        });

        // Validate user
        user.validate();

        // Insert user
        const result = await this.userRepository.insert(user);
        this.logger.log(
            'AddDefaultUser execute',
            'Default user (role: "ADMINISTRATOR") have been inserted',
        );
        return result;
    }
}
