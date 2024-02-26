import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    readonly validPassword: string;
}

export class UpdateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly email: string;
}
