import { ApiProperty } from "@nestjs/swagger";
import { EventDetailsDto } from "src/modules/events/dto/events-details.dto";
import { UserDetailsDto } from "src/modules/users/dto/user-details.dto";

export class StudentOrganisationDetailsDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  followers: number

  @ApiProperty({ type: [EventDetailsDto]})
  upcomingEvents: EventDetailsDto[];

  @ApiProperty({ type: [EventDetailsDto]})
  finishedEvents: EventDetailsDto[];

  @ApiProperty()
  socialMedia: string[];

  @ApiProperty()
  logoUrl: string;

  @ApiProperty()
  createdAt: string;
}
