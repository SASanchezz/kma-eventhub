import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MaxLength, IsOptional, IsNotEmpty, IsDateString, IsNumber, IsIn } from "class-validator";
import { EventFormats } from "./event.formats";


export class CreateEventDto {
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiProperty({
        type: String,
        enum: EventFormats,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @IsIn(Object.values(EventFormats))
    format: string;
    
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(4096)
    text: string;
  
    @ApiProperty({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    textPreview?: string;
  
    @ApiProperty({
        type: String,
        description: 'This is an required property',
    })
    @IsNotEmpty()
    @IsDateString()
    dateTime: string;

    @ApiProperty({
        type: Array,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    tags?: string;

    @ApiProperty({
        type: Number,
        description: 'This is an required property',
    })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    organisationId: number;

    @ApiProperty({
        type: Array,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.join(' '))
    partnerIds?: string;

    @ApiProperty({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    location?: string;

    @ApiProperty({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    price?: number;

    @ApiProperty({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;

    @ApiProperty({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    linkToRegister?: string;
}
