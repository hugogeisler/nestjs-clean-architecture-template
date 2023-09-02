import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';

@Module({
    imports: [UsecasesProxyModule.register()],
    controllers: [AuthController],
})
export class ControllersModule {}
