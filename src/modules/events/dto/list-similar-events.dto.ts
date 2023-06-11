import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ListSimilarEventsDto {
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
