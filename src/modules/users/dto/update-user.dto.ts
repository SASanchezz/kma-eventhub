import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, IsOptional, IsUrl } from "class-validator";


export class UpdateUserDto {
	@ApiProperty({ type: String })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	readonly name?: string;

	@ApiProperty({ type: String })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	readonly surname?: string;

	@ApiProperty({ type: String })
	@IsOptional()
	@IsUrl()
	@MaxLength(255)
	readonly imageUrl?: string;
}
