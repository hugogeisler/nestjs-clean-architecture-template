import { IsAuthenticatedUseCases } from '@domain/use-cases/authentication/isAuthenticated.use-case';
import { LoginUseCases } from '@domain/use-cases/authentication/login.use-case';
import { JwtAuthGuard } from '@infrastructure/common/guards/jwt-auth.guard';
import JwtRefreshGuard from '@infrastructure/common/guards/jwt-refresh.guard';
import { UseCaseProxy } from '@infrastructure/use-cases-proxy/use-case.proxy';
import { UsecasesProxyModule } from '@infrastructure/use-cases-proxy/use-cases.module';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

describe('infrastructure/controllers/auth', () => {
    // ------------------------------------------------------------------
    // Init the app and mock the usecases
    // ------------------------------------------------------------------
    let app: INestApplication;
    let loginUseCase: LoginUseCases;
    let isAuthenticatedUseCases: IsAuthenticatedUseCases;

    beforeAll(async () => {
        loginUseCase = {} as LoginUseCases;
        loginUseCase.getCookieWithJwtToken = jest.fn();
        loginUseCase.validateUserForLocalStragtegy = jest.fn();
        loginUseCase.getCookieWithJwtRefreshToken = jest.fn();
        const loginUsecaseProxyService: UseCaseProxy<LoginUseCases> = {
            getInstance: () => loginUseCase,
        } as UseCaseProxy<LoginUseCases>;

        isAuthenticatedUseCases = {} as IsAuthenticatedUseCases;
        isAuthenticatedUseCases.execute = jest.fn();
        const isAuthUsecaseProxyService: UseCaseProxy<IsAuthenticatedUseCases> =
            {
                getInstance: () => isAuthenticatedUseCases,
            } as UseCaseProxy<IsAuthenticatedUseCases>;

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(
                UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
            )
            .useValue(isAuthUsecaseProxyService)
            .overrideProvider(UsecasesProxyModule.LOGIN_USECASES_PROXY)
            .useValue(loginUsecaseProxyService)
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate(context: ExecutionContext) {
                    const req = context.switchToHttp().getRequest();
                    req.user = { username: 'username' };
                    return (
                        JSON.stringify(req.cookies) ===
                        JSON.stringify({
                            Authentication: '123456',
                            Path: '/',
                            'Max-Age': '1800',
                        })
                    );
                },
            })
            .overrideGuard(JwtRefreshGuard)
            .useValue({
                canActivate(context: ExecutionContext) {
                    const req = context.switchToHttp().getRequest();
                    req.user = { username: 'username' };
                    return true;
                },
            })
            .compile();

        app = moduleRef.createNestApplication();
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    // ------------------------------------------------------------------
    // Login
    // ------------------------------------------------------------------
    it(`/POST login should return 201`, async () => {
        (
            loginUseCase.validateUserForLocalStragtegy as jest.Mock
        ).mockReturnValue(
            Promise.resolve({
                id: 1,
                email: 'email',
                role: 'USER',
                lastLogin: null,
                hashRefreshToken: null,
            }),
        );
        (loginUseCase.getCookieWithJwtToken as jest.Mock).mockReturnValue(
            Promise.resolve(
                `Authentication=123456; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`,
            ),
        );
        (
            loginUseCase.getCookieWithJwtRefreshToken as jest.Mock
        ).mockReturnValue(
            Promise.resolve(
                `Refresh=12345; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
            ),
        );

        const result = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'email', password: 'password' })
            .expect(201);

        expect(result.headers['set-cookie']).toEqual([
            `Authentication=123456; HttpOnly; Path=/; Max-Age=1800`,
            `Refresh=12345; HttpOnly; Path=/; Max-Age=86400`,
        ]);
    });

    it(`/POST login should return 401`, async () => {
        (
            loginUseCase.validateUserForLocalStragtegy as jest.Mock
        ).mockReturnValue(Promise.resolve(null));

        await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'email', password: 'password' })
            .expect(401);
    });

    // ------------------------------------------------------------------
    // Logout
    // ------------------------------------------------------------------
    it(`/POST logout should return 201`, async () => {
        const result = await request(app.getHttpServer())
            .post('/auth/logout')
            .set('Cookie', [
                'Authentication=123456; HttpOnly; Path=/; Max-Age=1800',
            ])
            .send()
            .expect(201);

        expect(result.headers['set-cookie']).toEqual([
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
        ]);
    });

    // ------------------------------------------------------------------
    // Refresh token
    // ------------------------------------------------------------------
    it(`/POST Refresh token should return 201`, async () => {
        (loginUseCase.getCookieWithJwtToken as jest.Mock).mockReturnValue(
            Promise.resolve(
                `Authentication=123456; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`,
            ),
        );

        const result = await request(app.getHttpServer())
            .get('/auth/refresh')
            .send()
            .expect(200);

        expect(result.headers['set-cookie']).toEqual([
            `Authentication=123456; HttpOnly; Path=/; Max-Age=1800`,
        ]);
    });

    // ------------------------------------------------------------------
    // Is authenticated
    // ------------------------------------------------------------------
    it(`/GET is_authenticated should return 200`, async () => {
        (isAuthenticatedUseCases.execute as jest.Mock).mockReturnValue(
            Promise.resolve({ email: 'email' }),
        );

        await request(app.getHttpServer())
            .get('/auth/is_authenticated')
            .set('Cookie', [
                'Authentication=123456; HttpOnly; Path=/; Max-Age=1800',
            ])
            .send()
            .expect(200);
    });

    it(`/GET is_authenticated should return 403`, async () => {
        (isAuthenticatedUseCases.execute as jest.Mock).mockReturnValue(
            Promise.resolve({ email: 'email' }),
        );

        await request(app.getHttpServer())
            .get('/auth/is_authenticated')
            .send()
            .expect(403);
    });
});
