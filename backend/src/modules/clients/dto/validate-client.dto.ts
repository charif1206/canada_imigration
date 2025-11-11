import { IsOptional, IsString } from 'class-validator';

export class ValidateClientDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
