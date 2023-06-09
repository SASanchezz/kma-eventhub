import { ApiProperty } from "@nestjs/swagger";

export class UserDetailsDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  likes: number[];

  @ApiProperty()
  follows: number[];

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  createdAt: string;
}
