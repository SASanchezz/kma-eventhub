import { ApiProperty } from "@nestjs/swagger";

export class AllFiltersListDto {
  @ApiProperty()
  tags: string[];

  @ApiProperty()
  studentOrganisations: string[];
  
  @ApiProperty()
  locations: string[];
}
