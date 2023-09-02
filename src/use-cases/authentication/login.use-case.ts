import { ICryptService } from '@domain/adapters/crypt.interface';
import { IJwtService, IJwtServicePayload } from '@domain/adapters/jwt.interface';
import { JWTConfig } from '@domain/config/jwt.interface';
import { ILogger } from '@domain/logger/logger.interface';
import { UserRepository } from '@domain/repositories/user-repository.interface';

export class LoginUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly jwtTokenService: IJwtService,
        private readonly jwtConfig: JWTConfig,
        private readonly userRepository: UserRepository,
        private readonly cryptService: ICryptService,
    ) {}

    public async getCookieWithJwtToken(username: string) {
        this.logger.log('LoginUseCases execute', `The user ${username} have been logged.`);
        const payload: IJwtServicePayload = { username: username };
        const secret = this.jwtConfig.getJwtSecret();
        const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
        const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`;
    }

    public async getCookieWithJwtRefreshToken(username: string) {
        this.logger.log('LoginUseCases execute', `The user ${username} have been logged.`);
        const payload: IJwtServicePayload = { username: username };
        const secret = this.jwtConfig.getJwtRefreshSecret();
        const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
        const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
        await this.setCurrentRefreshToken(token, username);
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`;
        return cookie;
    }

    public async validateUserForLocalStragtegy(email: string, pass: string) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            return null;
        }
        const match = await this.cryptService.compare(pass, user.password);
        if (user && match) {
            await this.updateLoginTime(user.email);
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    public async validateUserForJWTStragtegy(email: string) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            return null;
        }
        return user;
    }

    public async updateLoginTime(email: string) {
        await this.userRepository.updateLastLogin(email);
    }

    public async setCurrentRefreshToken(refreshToken: string, email: string) {
        const currentHashedRefreshToken = await this.cryptService.hash(refreshToken);
        await this.userRepository.updateRefreshToken(email, currentHashedRefreshToken);
    }

    public async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            return null;
        }

        const isRefreshTokenMatching = await this.cryptService.compare(refreshToken, user.hashRefreshToken);
        if (isRefreshTokenMatching) {
            return user;
        }

        return null;
    }
}
