import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { SORequestStatuses } from "src/modules/student-organisations/types/so-requests.statuses";

@ValidatorConstraint({ name: 'isValidSORequestStatus', async: false })
export class IsValidSORequestStatusConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
		if (!Array.isArray(value)) {
			return false;
		}

		const validStatuses = Object.values(SORequestStatuses);
		for (const item of value) {
			if (!validStatuses.includes(item)) {
				return false;
			}
		}

		return true;
	}
}

export class ListAllStudentOrganisationsDto {
	@ApiPropertyOptional({
		type: [String],
		description: 'This is an optional property. Available values are: "Sent", "On review", "Rejected", "Approved"',
	})
	@IsOptional()
	@Validate(IsValidSORequestStatusConstraint, {
		message: 'Invalid SORequestStatuses provided.',
	})
	statuses: string[];
}
