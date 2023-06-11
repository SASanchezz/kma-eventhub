import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';


export type DateTimeComparisonType  = 'gt' | 'lt';
export const GREATER: DateTimeComparisonType  = 'gt';
export const LOWER: DateTimeComparisonType  = 'lt';

export class ListAllEventsDto {
  @ApiPropertyOptional({
    description: 'Search by title, textPreview, tags',
  })
  @IsOptional()
  @IsString()
  all?: string;

  @ApiPropertyOptional({
    description: 'Search by dateTime',
  })
  @IsOptional()
  @IsString()
  @IsDate()
  dateTime?: string;

  // greater or lower than dateTime
  @ApiPropertyOptional({
    description: 'Way to compare dateTime',
  })
  @IsOptional()
  @IsString()
  @IsIn([GREATER, LOWER])
  dateTimeComparison?: DateTimeComparisonType ;

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
