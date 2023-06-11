import { ApiProperty } from '@nestjs/swagger';

export enum EmailStatuses {
  USER = 'user',
  ORGANISATION = 'organisation',
  NONE = 'none',
}

export class EmailStatusResponseDto {
  @ApiProperty({ enum: EmailStatuses })
  type: EmailStatuses;
}
