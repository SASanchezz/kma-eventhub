import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, IsEmail, IsPhoneNumber, IsOptional, IsNotEmpty } from "class-validator";


export class LoginDto {
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
    readonly password: string;
}
