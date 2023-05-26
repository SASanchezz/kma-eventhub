import { ApiProperty } from "@nestjs/swagger";

export class TokensPairDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;
}
