import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { UseCaseProxy } from '@infrastructure/use-cases-proxy/use-case.proxy';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUseCases } from '@domain/use-cases/authentication/login.use-case';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtServicePayload } from '@domain/adapters/jwt.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor(
        private readonly configService: EnvironmentConfigService,
        @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
        private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
        private readonly logger: LoggerService,
        private readonly exceptionService: ExceptionsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: configService.getJwtRefreshSecret(),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: IJwtServicePayload) {
        const refreshToken = request.cookies?.Refresh;
        const user = this.loginUsecaseProxy
            .getInstance()
            .getUserIfRefreshTokenMatches(refreshToken, payload.email);
        if (!user) {
            this.logger.warn(
                'JwtStrategy',
                `User not found or hash not correct`,
            );
            this.exceptionService.UnauthorizedException({
                message: 'User not found or hash not correct',
            });
        }
        return user;
    }
}
