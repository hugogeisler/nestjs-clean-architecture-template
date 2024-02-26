import { UseCaseProxy } from '@infrastructure/use-cases-proxy/use-case.proxy';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AddUserDto, UpdateUserDto } from './user.dto';
import { ApiResponseType } from '@infrastructure/common/swagger/response.decorator';
import { UserPresenter } from './user.presenter';
import { JwtAuthGuard } from '@infrastructure/common/guards/jwt-auth.guard';
import { getUserUseCases } from '@domain/use-cases/users/get-user.use-case';
import { getAllUsersUseCases } from '@domain/use-cases/users/get-all-users.use-case';
import { updateUserUseCases } from '@domain/use-cases/users/update-user.use-case';
import { deleteUserUseCases } from '@domain/use-cases/users/delete-user.use-case';
import {
    HasRoles,
    RolesGuard,
} from '@infrastructure/common/guards/roles.guard';
import { AppContext } from '@infrastructure/decorators/app-context.decorator';
import { Context } from '@domain/context/context.interface';

@Controller('users')
@ApiTags('user')
@ApiResponse({
    status: 401,
    description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(UserPresenter)
export class UserHttpController {
    constructor(
        @Inject(UsecasesProxyModule.GET_USER_USECASES_PROXY)
        private readonly getUserUsecaseProxy: UseCaseProxy<getUserUseCases>,
        @Inject(UsecasesProxyModule.GET_USERS_USECASES_PROXY)
        private readonly getAllUsersUsecaseProxy: UseCaseProxy<getAllUsersUseCases>,
        @Inject(UsecasesProxyModule.PUT_USER_USECASES_PROXY)
        private readonly putUserUsecaseProxy: UseCaseProxy<updateUserUseCases>,
        @Inject(UsecasesProxyModule.DELETE_USER_USECASES_PROXY)
        private readonly deleteUserUsecaseProxy: UseCaseProxy<deleteUserUseCases>,
    ) {}

    @Get(':userId')
    @ApiOperation({ description: 'get-user' })
    @ApiResponseType(UserPresenter, false)
    async getUser(
        @AppContext() context: Context,
        @Param('userId') userId: string,
    ) {
        const user = await this.getUserUsecaseProxy
            .getInstance()
            .execute(context, userId);
        return new UserPresenter(user);
    }

    @Get()
    @ApiOperation({ description: 'get-all-users' })
    @ApiResponseType(UserPresenter, true)
    async getAllUsers() {
        const users = await this.getAllUsersUsecaseProxy
            .getInstance()
            .execute();
        return users.map((user) => new UserPresenter(user));
    }

    @Put(':userId')
    @ApiOperation({ description: 'update-user' })
    async updateUser(
        @AppContext() context: Context,
        @Param('userId') userId: string,
        @Body() user: UpdateUserDto,
    ) {
        const { email } = user;
        await this.putUserUsecaseProxy.getInstance().execute(context, userId, {
            email,
        });
    }

    @Delete(':userId')
    @ApiOperation({ description: 'delete-user' })
    async deleteUser(@Param('userId') userId: string) {
        await this.deleteUserUsecaseProxy.getInstance().execute(userId);
    }
}
