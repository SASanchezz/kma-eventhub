import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListAllEventsDto {
  @ApiPropertyOptional({
    description: 'Search by textPreview',
  })
  @IsOptional()
  @IsString()
  all?: string;

  @ApiPropertyOptional({
    description: 'Search by one tag',
  })
  @IsOptional()
  @IsString()
  tag: string;

  @ApiPropertyOptional({
    description: 'Search SO id',
  })
  @IsOptional()
  @IsString()

  studentOrganisationName?: string;

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
    description: 'Search SO id',
  })
  @IsOptional()
  @IsString()
  location?: string;

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
