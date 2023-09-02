import { Column, CreateDateColumn, Entity, ObjectIdColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @ObjectIdColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    last_login?: Date;

    @Column('varchar', { nullable: true })
    hach_refresh_token: string;

    @CreateDateColumn({ name: 'createdate' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updateddate' })
    updated_at: Date;
}
