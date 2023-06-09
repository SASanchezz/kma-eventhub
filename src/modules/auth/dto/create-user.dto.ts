import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, IsEmail, IsPhoneNumber, IsOptional, IsNotEmpty } from "class-validator";


export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsEmail()
    @MaxLength(255)
    readonly email: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly name: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly surname: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    password: string;
}
