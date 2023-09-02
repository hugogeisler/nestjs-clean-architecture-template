import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { RepositoriesModule } from '@infrastructure/respositories/repositories.module';
import { DatabaseUserRepository } from '@infrastructure/respositories/user.repository';
import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './use-case.proxy';
import { LoginUseCases } from '@use-cases/authentication/login.use-case';
import { IsAuthenticatedUseCases } from '@use-cases/authentication/isAuthenticated.use-case';
import { LogoutUseCases } from '@use-cases/authentication/logout.use-case';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import { CryptService } from '@infrastructure/services/crypt/crypt.service';
import { CryptModule } from '@infrastructure/services/crypt/crypt.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { JwtModule } from '@infrastructure/services/jwt/jwt.module';

@Module({
    imports: [LoggerModule, JwtModule, CryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
    // Authentication
    static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
    static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
    static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

    static register(): DynamicModule {
        return {
            module: UsecasesProxyModule,
            providers: [
                {
                    inject: [
                        LoggerService,
                        JwtTokenService,
                        EnvironmentConfigService,
                        DatabaseUserRepository,
                        CryptService,
                    ],
                    provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
                    useFactory: (
                        logger: LoggerService,
                        jwtTokenService: JwtTokenService,
                        config: EnvironmentConfigService,
                        userRepo: DatabaseUserRepository,
                        bcryptService: CryptService,
                    ) => new UseCaseProxy(new LoginUseCases(logger, jwtTokenService, config, userRepo, bcryptService)),
                },
                {
                    inject: [DatabaseUserRepository],
                    provide: UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
                    useFactory: (userRepo: DatabaseUserRepository) =>
                        new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
                },
                {
                    inject: [],
                    provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
                    useFactory: () => new UseCaseProxy(new LogoutUseCases()),
                },
            ],
            exports: [
                UsecasesProxyModule.LOGIN_USECASES_PROXY,
                UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
                UsecasesProxyModule.LOGOUT_USECASES_PROXY,
            ],
        };
    }
}
