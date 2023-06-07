import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";


export class FollowOrganisationDto {
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    userId: number;
    
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    organisationId: number;
}
