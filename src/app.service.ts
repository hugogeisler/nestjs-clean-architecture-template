import { addDefaultUserUseCases } from '@domain/use-cases/users/add-default-user.use-case';
import { UseCaseProxy } from '@infrastructure/use-cases-proxy/use-case.proxy';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(
        @Inject(UsecasesProxyModule.ADD_DEFAULT_USER_USECASES_PROXY)
        private readonly addDefaultUserUseCase: UseCaseProxy<addDefaultUserUseCases>,
    ) {}

    async onApplicationBootstrap() {
        await this.addDefaultUserUseCase.getInstance().execute();
    }
}
