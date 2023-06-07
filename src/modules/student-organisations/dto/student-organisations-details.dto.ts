import { ApiProperty } from "@nestjs/swagger";
import { EventDetailsDto } from "src/modules/events/dto/events-details.dto";
import { Events } from "src/modules/events/events.entity";
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
  followers: UserDetailsDto[]

  @ApiProperty()
  upcomingEvents: EventDetailsDto[];

  @ApiProperty()
  finishedEvents: EventDetailsDto[];

  @ApiProperty()
  socialMedia: string[];

  @ApiProperty()
  logoUrl: string;

  @ApiProperty()
  createdAt: string;
}
