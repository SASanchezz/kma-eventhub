import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MaxLength, IsOptional, IsNotEmpty, IsDateString } from "class-validator";


export class UpdateEventDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;
    
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @MaxLength(4096)
    text: string;
  
    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    textPreview?: string;
  
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsDateString()
    dateTime: string;

    @ApiProperty({ type: Array })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    tags?: string;

    @ApiProperty({ type: Array })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    partnerIds?: string;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    location?: string;

    @ApiProperty({ type: Number })
    @IsOptional()
    @IsString()
    price?: number;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    linkToRegister?: string;
}
