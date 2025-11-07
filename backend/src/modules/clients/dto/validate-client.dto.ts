import { IsBoolean } from 'class-validator';

export class ValidateClientDto {
  @IsBoolean({ message: 'Validation status must be true or false. Please specify whether the client is validated.' })
  isValidated: boolean;
}
