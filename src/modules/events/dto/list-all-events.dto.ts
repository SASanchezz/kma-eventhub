import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';


export type DateTimeComparisonType  = 'gt' | 'lt';
export const GREATER: DateTimeComparisonType  = 'gt';
export const LOWER: DateTimeComparisonType  = 'lt';

export class ListAllEventsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  all?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsDate()
  dateTime?: string;

  // greater or lower than dateTime
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn([GREATER, LOWER])
  dateTimeComparison?: DateTimeComparisonType ;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit?: number;
}
