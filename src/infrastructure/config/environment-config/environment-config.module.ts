import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './environment-config.validation';
import { EnvironmentConfigService } from './environment-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
        }),
    ],
    providers: [EnvironmentConfigService],
    exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
