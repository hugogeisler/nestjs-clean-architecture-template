import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { Module } from '@nestjs/common';
import { AuthHttpController } from './auth/auth.controller';
import { UserHttpController } from './user/user.controller';

@Module({
    imports: [UsecasesProxyModule.register()],
    controllers: [AuthHttpController, UserHttpController],
})
export class HttpControllersModule {}
