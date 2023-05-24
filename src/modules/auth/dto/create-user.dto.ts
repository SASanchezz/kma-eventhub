import { IsString, MaxLength, IsEmail, IsPhoneNumber, IsDateString, IsOptional, IsNotEmpty } from "class-validator";


export class CreateUserDto {
    @IsEmail()
    @MaxLength(255)
    readonly email: string;

    @IsNotEmpty()
    @IsOptional()
    @IsPhoneNumber('UA')
    @MaxLength(255)
    readonly phone: string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly surname: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly patronymic: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    password: string;
}
