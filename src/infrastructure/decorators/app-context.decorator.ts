import { UserAggregate } from '@domain/aggregates/user.aggregate';
import type { Context } from '@domain/context/context.interface';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AppContext = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Context => {
        const request = ctx.switchToHttp().getRequest();

        return {
            user: request.user as UserAggregate,
        };
    },
);
