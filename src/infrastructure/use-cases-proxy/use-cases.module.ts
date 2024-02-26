import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { RepositoriesModule } from '@infrastructure/respositories/repositories.module';
import { DatabaseUserRepository } from '@infrastructure/respositories/user/user.repository';
import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './use-case.proxy';
import { LoginUseCases } from '@domain/use-cases/authentication/login.use-case';
import { IsAuthenticatedUseCases } from '@domain/use-cases/authentication/isAuthenticated.use-case';
import { LogoutUseCases } from '@domain/use-cases/authentication/logout.use-case';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import { CryptService } from '@infrastructure/services/crypt/crypt.service';
import { CryptModule } from '@infrastructure/services/crypt/crypt.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { JwtModule } from '@infrastructure/services/jwt/jwt.module';
import { getUserUseCases } from '@domain/use-cases/users/get-user.use-case';
import { getAllUsersUseCases } from '@domain/use-cases/users/get-all-users.use-case';
import { deleteUserUseCases } from '@domain/use-cases/users/delete-user.use-case';
import { updateUserUseCases } from '@domain/use-cases/users/update-user.use-case';
import { addUserUseCases } from '@domain/use-cases/users/add-user.use-case';
import { UuidService } from '@infrastructure/services/uuid/uuid.service';
import { UuidModule } from '@infrastructure/services/uuid/uuid.module';
import { addDefaultUserUseCases } from '@domain/use-cases/users/add-default-user.use-case';

@Module({
    imports: [
        LoggerModule,
        JwtModule,
        CryptModule,
        EnvironmentConfigModule,
        RepositoriesModule,
        ExceptionsModule,
        UuidModule,
    ],
})
export class UsecasesProxyModule {
    // Authentication
    static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
    static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
    static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

    // User
    static POST_USER_USECASES_PROXY = 'PostUserUseCasesProxy';
    static GET_USER_USECASES_PROXY = 'GetUserUseCasesProxy';
    static GET_USERS_USECASES_PROXY = 'GetUsersUseCasesProxy';
    static PUT_USER_USECASES_PROXY = 'PutUserUseCasesProxy';
    static DELETE_USER_USECASES_PROXY = 'DeleteUserUseCasesProxy';
    static ADD_DEFAULT_USER_USECASES_PROXY = 'AddDefaultUserUseCasesProxy';

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
                {
                    inject: [LoggerService, DatabaseUserRepository],
                    provide: UsecasesProxyModule.GET_USER_USECASES_PROXY,
                    useFactory: (logger: LoggerService, userRepo: DatabaseUserRepository) =>
                        new UseCaseProxy(new getUserUseCases(logger, userRepo)),
                },
                {
                    inject: [LoggerService, DatabaseUserRepository],
                    provide: UsecasesProxyModule.GET_USERS_USECASES_PROXY,
                    useFactory: (logger: LoggerService, userRepo: DatabaseUserRepository) =>
                        new UseCaseProxy(new getAllUsersUseCases(logger, userRepo)),
                },
                {
                    inject: [LoggerService, DatabaseUserRepository],
                    provide: UsecasesProxyModule.DELETE_USER_USECASES_PROXY,
                    useFactory: (logger: LoggerService, userRepo: DatabaseUserRepository) =>
                        new UseCaseProxy(new deleteUserUseCases(logger, userRepo)),
                },
                {
                    inject: [
                        LoggerService,
                        DatabaseUserRepository,
                        CryptService,
                        UuidService,
                        EnvironmentConfigService,
                    ],
                    provide: UsecasesProxyModule.ADD_DEFAULT_USER_USECASES_PROXY,
                    useFactory: (
                        logger: LoggerService,
                        userRepo: DatabaseUserRepository,
                        crypt: CryptService,
                        uuid: UuidService,
                        config: EnvironmentConfigService,
                    ) => new UseCaseProxy(new addDefaultUserUseCases(logger, userRepo, crypt, uuid, config)),
                },
                {
                    inject: [LoggerService, DatabaseUserRepository],
                    provide: UsecasesProxyModule.PUT_USER_USECASES_PROXY,
                    useFactory: (logger: LoggerService, userRepo: DatabaseUserRepository) =>
                        new UseCaseProxy(new updateUserUseCases(logger, userRepo)),
                },
                {
                    inject: [LoggerService, DatabaseUserRepository, UuidService],
                    provide: UsecasesProxyModule.POST_USER_USECASES_PROXY,
                    useFactory: (
                        logger: LoggerService,
                        userRepo: DatabaseUserRepository,
                        cryptService: CryptService,
                        uuidService: UuidService,
                    ) => new UseCaseProxy(new addUserUseCases(logger, userRepo, cryptService, uuidService)),
                },
            ],
            exports: [
                // Authentication
                UsecasesProxyModule.LOGIN_USECASES_PROXY,
                UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
                UsecasesProxyModule.LOGOUT_USECASES_PROXY,

                // User
                UsecasesProxyModule.POST_USER_USECASES_PROXY,
                UsecasesProxyModule.GET_USER_USECASES_PROXY,
                UsecasesProxyModule.GET_USERS_USECASES_PROXY,
                UsecasesProxyModule.DELETE_USER_USECASES_PROXY,
                UsecasesProxyModule.PUT_USER_USECASES_PROXY,
                UsecasesProxyModule.ADD_DEFAULT_USER_USECASES_PROXY,
            ],
        };
    }
}
