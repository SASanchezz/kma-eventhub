import { ApiProperty } from "@nestjs/swagger";

export class UserDetailsDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  patronymic: string;
  
  @ApiProperty()
  created_at: string;
}
