import { IsNumber, IsOptional } from 'class-validator';

export class ListSimilarEventsDto {
  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
