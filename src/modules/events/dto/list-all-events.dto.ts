import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsIn, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { EventFormats } from './event.formats';

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // HH:mm
export const BoolValues = {
  TRUE: 'true',
  FALSE: 'false',
}

export class ListAllEventsDto {
  @ApiPropertyOptional({
    description: 'Search by textPreview',
  })
  @IsOptional()
  @IsString()
  all?: string;

  @ApiPropertyOptional({
    description: 'Search by tags',
  })
  @IsOptional()
  @IsArray()
  tags: string[];

  @ApiPropertyOptional({
    description: 'Search by priced or free event',
    enum: BoolValues,
  })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(BoolValues))
  isFree: string;

  @ApiPropertyOptional({
    description: 'Search by priced or free event',
    enum: EventFormats,
  })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(EventFormats))
  format: string;

  @ApiPropertyOptional({
    description: 'Search by so names',
  })
  @IsOptional()
  @IsArray()
  studentOrganisationNames?: string[];

  @ApiPropertyOptional({
    description: 'Search by dateTime from some moment',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  dateTimeFrom?: string;

  @ApiPropertyOptional({
    description: 'Search by dateTime to some moment',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  dateTimeTo?: string;

  @ApiPropertyOptional({
    description: 'Search by date',
  })
  @IsOptional()
  @IsString()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Search by time',
  })
  @IsOptional()
  @IsString()
  @Matches(timeRegex)
  time?: string;

  @ApiPropertyOptional({
    description: 'Search by locations',
  })
  @IsOptional()
  @IsArray()
  locations?: string[];

  @ApiPropertyOptional({
    description: 'Offset for pagination',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  offset?: number;

  @ApiPropertyOptional({
    description: 'Limit for pagination',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;
}
