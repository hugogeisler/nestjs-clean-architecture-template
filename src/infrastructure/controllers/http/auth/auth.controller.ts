import { LoginGuard } from '@infrastructure/common/guards/login.guard';
import { UseCaseProxy } from '@infrastructure/use-cases-proxy/use-case.proxy';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { IsAuthenticatedUseCases } from '@domain/use-cases/authentication/isAuthenticated.use-case';
import { LoginUseCases } from '@domain/use-cases/authentication/login.use-case';
import { LogoutUseCases } from '@domain/use-cases/authentication/logout.use-case';
import { AuthLoginDto } from './auth.dto';
import { IsAuthPresenter } from './auth.presenter';
import { JwtAuthGuard } from '@infrastructure/common/guards/jwt-auth.guard';
import { ApiResponseType } from '@infrastructure/common/swagger/response.decorator';
import JwtRefreshGuard from '@infrastructure/common/guards/jwt-refresh.guard';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
    status: 401,
    description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthHttpController {
    constructor(
        @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
        private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
        @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
        private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
        @Inject(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
        private readonly isAuthUsecaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
    ) {}

    @Post('login')
    @UseGuards(LoginGuard)
    @ApiBearerAuth()
    @ApiBody({ type: AuthLoginDto })
    @ApiOperation({ description: 'login' })
    async login(@Body() auth: AuthLoginDto, @Request() request: any) {
        const accessTokenCookie = await this.loginUsecaseProxy
            .getInstance()
            .getCookieWithJwtToken(auth.email);
        const refreshTokenCookie = await this.loginUsecaseProxy
            .getInstance()
            .getCookieWithJwtRefreshToken(auth.email);
        request.res.setHeader('Set-Cookie', [
            accessTokenCookie,
            refreshTokenCookie,
        ]);
        return 'Login successful';
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ description: 'logout' })
    async logout(@Request() request: any) {
        const cookie = await this.logoutUsecaseProxy.getInstance().execute();
        request.res.setHeader('Set-Cookie', cookie);
        return 'Logout successful';
    }

    @Get('is_authenticated')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ description: 'is_authenticated' })
    @ApiResponseType(IsAuthPresenter, false)
    async isAuthenticated(@Req() request: any) {
        const user = await this.isAuthUsecaseProxy
            .getInstance()
            .execute(request.user.email);
        return new IsAuthPresenter(user.email);
    }

    @Get('refresh')
    @ApiBearerAuth()
    @UseGuards(JwtRefreshGuard)
    @ApiOperation({ description: 'refresh' })
    async refresh(@Req() request: any) {
        const accessTokenCookie = await this.loginUsecaseProxy
            .getInstance()
            .getCookieWithJwtToken(request.user.email);
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return 'Refresh successful';
    }
}
