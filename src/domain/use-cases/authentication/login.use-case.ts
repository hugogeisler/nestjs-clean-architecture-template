import { ICryptService } from '@domain/adapters/crypt.interface';
import {
    IJwtService,
    IJwtServicePayload,
} from '@domain/adapters/jwt.interface';
import { JWTConfig } from '@domain/config/jwt.interface';
import { ILogger } from '@domain/logger/logger.interface';
import { UserRepository } from '@domain/repositories/user-repository.interface';
import { UnauthorizedException } from '@nestjs/common';

export class LoginUseCases {
    constructor(
        private readonly logger: ILogger,
        private readonly jwtTokenService: IJwtService,
        private readonly jwtConfig: JWTConfig,
        private readonly userRepository: UserRepository,
        private readonly cryptService: ICryptService,
    ) {}

    public async getCookieWithJwtToken(email: string) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');

        const payload: IJwtServicePayload = {
            user_id: user.id,
            email,
            role: user.role,
        };

        const secret = this.jwtConfig.getJwtSecret();
        const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
        const token = this.jwtTokenService.createToken(
            payload,
            secret,
            expiresIn,
        );

        this.logger.log(
            'LoginUseCases execute',
            `The user ${email} have been logged.`,
        );
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`;
    }

    public async getCookieWithJwtRefreshToken(email: string) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');

        const payload: IJwtServicePayload = {
            user_id: user.id,
            email,
            role: user.role,
        };

        const secret = this.jwtConfig.getJwtRefreshSecret();
        const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
        const token = this.jwtTokenService.createToken(
            payload,
            secret,
            expiresIn,
        );
        await this.setCurrentRefreshToken(token, email);

        this.logger.log(
            'LoginUseCases execute',
            `The user ${email} have been logged.`,
        );
        return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`;
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
        const currentHashedRefreshToken = await this.cryptService.hash(
            refreshToken,
        );
        await this.userRepository.updateRefreshToken(
            email,
            currentHashedRefreshToken,
        );
    }

    public async getUserIfRefreshTokenMatches(
        refreshToken: string,
        email: string,
    ) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            return null;
        }

        const isRefreshTokenMatching = await this.cryptService.compare(
            refreshToken,
            user.hash_refresh_token,
        );
        if (isRefreshTokenMatching) {
            return user;
        }

        return null;
    }
}
