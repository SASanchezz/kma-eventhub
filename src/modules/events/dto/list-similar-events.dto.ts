import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ListSimilarEventsDto {
  @ApiPropertyOptional({
    description: 'Offset for pagination',
  })
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Limit for pagination',
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
