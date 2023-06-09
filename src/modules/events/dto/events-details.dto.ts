import { ApiProperty } from "@nestjs/swagger";

export class EventDetailsDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  title: string;

  @ApiProperty()
  format: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  textPreview: string;

  @ApiProperty()
  dateTime: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  organisationId: number;

  @ApiProperty()
  partnerIds: number[];

  @ApiProperty()
  location: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  linkToRegister: string
  
  @ApiProperty()
  createdAt: string;
}
