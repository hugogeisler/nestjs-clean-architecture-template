import { HttpControllersModule } from '@infrastructure/controllers/http/http-controlleur.module';
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { CryptModule } from '@infrastructure/services/crypt/crypt.module';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtModule as JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { LocalStrategy } from '@infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from '@infrastructure/common/strategies/jwt-refresh.strategy';
import { UuidModule } from '@infrastructure/services/uuid/uuid.module';
import { AppService } from './app.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.secret,
        }),
        LoggerModule,
        ExceptionsModule,
        UsecasesProxyModule.register(),
        HttpControllersModule,
        CryptModule,
        JwtServiceModule,
        UuidModule,
        EnvironmentConfigModule,
    ],
    providers: [
        LocalStrategy,
        JwtStrategy,
        JwtRefreshTokenStrategy,
        AppService,
    ],
})
export class AppModule {}
