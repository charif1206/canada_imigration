import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class PartnerSubmissionDto {
  @IsNotEmpty({ message: 'Agency name is required.' })
  @IsString({ message: 'Agency name must be a valid text string.' })
  agencyName: string;

  @IsNotEmpty({ message: 'Manager name is required.' })
  @IsString({ message: 'Manager name must be a valid text string.' })
  managerName: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required.' })
  @IsString({ message: 'Phone number must be a valid text string.' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Address must be a valid text string.' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a valid text string.' })
  city?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Client count must be a valid number.' })
  clientCount?: string;

  @IsOptional()
  @IsString({ message: 'Message must be a valid text string.' })
  message?: string;
}
