import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsString, MaxLength, IsEmail, IsOptional, IsNotEmpty, IsUrl, IsArray } from "class-validator";


export class CreateStudentOrganisationDto {
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    email: string;
    
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;
  
    @ApiProperty({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1023)
    description: string;
  
    @ApiProperty({
        type: Array,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    socialMedia: string;

    @ApiProperty({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    logoUrl: string;
}
