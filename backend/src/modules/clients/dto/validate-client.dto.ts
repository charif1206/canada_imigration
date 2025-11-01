import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ValidateClientDto {
  @IsBoolean({ message: 'Validation status must be true or false. Please specify whether the client is validated.' })
  isValidated: boolean;

  @IsOptional()
  @IsString({ message: 'Notes must be a valid text string if provided.' })
  notes?: string;
}
