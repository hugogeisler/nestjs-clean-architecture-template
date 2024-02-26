import { UserRole } from '@domain/aggregates/user.aggregate';
import {
    Column,
    Entity,
    ObjectIdColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
    name: 'users',
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ObjectIdColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ enum: ['ADMINISTRATOR', 'USER'], default: 'USER' })
    role: UserRole;

    @Column({ nullable: true })
    last_login?: Date;

    @Column({ nullable: true })
    hash_refresh_token: string;
}
