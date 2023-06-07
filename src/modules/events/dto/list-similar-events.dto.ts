import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ListSimilarEventsDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit?: number;
}
