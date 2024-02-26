import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { UseCaseProxy } from '@infrastructure/use-cases-proxy/use-case.proxy';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUseCases } from '@domain/use-cases/authentication/login.use-case';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
        private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
        private readonly logger: LoggerService,
        private readonly exceptionService: ExceptionsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                },
            ]),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const user = this.loginUsecaseProxy
            .getInstance()
            .validateUserForJWTStragtegy(payload.email);
        if (!user) {
            this.logger.warn('JwtStrategy', `User not found`);
            this.exceptionService.UnauthorizedException({
                message: 'User not found',
            });
        }
        return user;
    }
}
