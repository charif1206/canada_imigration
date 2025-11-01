import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'Name is required. Please provide the client\'s full name.' })
  @IsString({ message: 'Name must be a valid text string.' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address (e.g., client@example.com).' })
  @IsNotEmpty({ message: 'Email is required. Please provide the client\'s email address.' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required. Please provide the client\'s phone number.' })
  @IsString({ message: 'Phone number must be a valid text string.' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Passport number must be a valid text string if provided.' })
  passportNumber?: string;

  @IsOptional()
  @IsString({ message: 'Nationality must be a valid text string if provided.' })
  nationality?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date format (e.g., 1990-01-15).' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a valid text string if provided.' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Immigration type must be a valid text string if provided.' })
  immigrationType?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a valid text string if provided.' })
  notes?: string;
}