import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ValidateClientDto {
  @IsBoolean()
  isValidated: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
