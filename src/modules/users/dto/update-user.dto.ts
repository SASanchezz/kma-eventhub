import { IsString, MaxLength, IsEmail, IsPhoneNumber, IsDateString, IsStrongPassword, IsOptional } from "class-validator";


export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    readonly email: string;

    @IsOptional()
    @IsPhoneNumber('UA')
    @MaxLength(255)
    readonly phone: string;
    
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly surname: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly patronymic: string;

    @IsOptional()
    @IsStrongPassword()
    readonly password: string;
}