import { ApiProperty } from "@nestjs/swagger";
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

  // @ApiProperty()
  // upcomin_events: Object; //TODO when event entity will be created

  // @ApiProperty()
  // finished_events: Object; //TODO when event entity will be created

  @ApiProperty()
  socialMedia: string[];

  @ApiProperty()
  logoUrl: string;

  @ApiProperty()
  createdAt: string;
}
