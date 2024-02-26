import { UserAggregate } from '@domain/aggregates/user.aggregate';

export type Context = {
    user: UserAggregate;
};
