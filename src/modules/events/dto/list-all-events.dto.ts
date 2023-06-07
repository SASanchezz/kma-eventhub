import { IsDate, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';


export type DateTimeComparisonType  = 'gt' | 'lt';
export const GREATER: DateTimeComparisonType  = 'gt';
export const LOWER: DateTimeComparisonType  = 'lt';

export class ListAllEventsDto {
  @IsOptional()
  @IsString()
  all?: string;

  @IsOptional()
  @IsString()
  @IsDate()
  dateTime?: string;

  // greater or lower than dateTime
  @IsOptional()
  @IsString()
  @IsIn([GREATER, LOWER])
  dateTimeComparison?: DateTimeComparisonType ;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
