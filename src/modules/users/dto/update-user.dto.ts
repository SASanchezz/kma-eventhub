import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, IsEmail, IsPhoneNumber, IsDateString, IsStrongPassword, IsOptional } from "class-validator";


export class UpdateUserDto {
	@ApiProperty({ type: String })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	readonly name: string;

	@ApiProperty({ type: String })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	readonly surname: string;
}
