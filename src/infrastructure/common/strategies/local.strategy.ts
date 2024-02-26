import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { UseCaseProxy } from '@infrastructure/use-cases-proxy/use-case.proxy';
import { LoginUseCases } from '@domain/use-cases/authentication/login.use-case';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
        private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
        private readonly logger: LoggerService,
        private readonly exceptionService: ExceptionsService,
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string) {
        if (!email || !password) {
            this.logger.warn(
                'LocalStrategy',
                `Email or password is missing, BadRequestException`,
            );
            this.exceptionService.UnauthorizedException();
        }
        const user = await this.loginUsecaseProxy
            .getInstance()
            .validateUserForLocalStragtegy(email, password);
        if (!user) {
            this.logger.warn('LocalStrategy', `Invalid email or password`);
            this.exceptionService.UnauthorizedException({
                message: 'Invalid email or password.',
            });
        }
        return user;
    }
}
