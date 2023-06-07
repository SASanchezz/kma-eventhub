import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MaxLength, IsEmail, IsOptional, IsNotEmpty, IsUrl } from "class-validator";


export class UpdateStudentOrganisationDto {
    @ApiProperty({ type: String })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;
    
    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;
  
    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(1023)
    description?: string;

    @ApiProperty({ type: Array })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    socialMedia?: string;
  
    @ApiProperty({ type: String })
    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    logoUrl?: string;
}
