import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MaxLength, IsOptional, IsNotEmpty, IsDateString, IsIn } from "class-validator";
import { EventFormats } from "./event.formats";


export class UpdateEventDto {
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiPropertyOptional({ type: String, enum: EventFormats })
    @IsOptional()
    @IsString()
    @IsIn(Object.values(EventFormats))
    format: string;
    
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(4096)
    text: string;
  
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    textPreview?: string;
  
    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsDateString()
    dateTime: string;

    @ApiPropertyOptional({ type: Array })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    tags?: string;

    @ApiPropertyOptional({ type: Array })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    partnerIds?: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    location?: string;

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @IsString()
    price?: number;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    linkToRegister?: string;
}
