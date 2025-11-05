import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class EquivalenceFormDto {
  @IsNotEmpty({ message: 'First name is required.' })
  @IsString({ message: 'First name must be a valid text string.' })
  prenom: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString({ message: 'Last name must be a valid text string.' })
  nom: string;

  @IsNotEmpty({ message: 'Address is required.' })
  @IsString({ message: 'Address must be a valid text string.' })
  adresse: string;

  @IsNotEmpty({ message: 'Postal code is required.' })
  @IsString({ message: 'Postal code must be a valid text string.' })
  codePostal: string;

  @IsNotEmpty({ message: 'Education level is required.' })
  @IsString({ message: 'Education level must be a valid text string.' })
  niveau: string;

  @IsNotEmpty({ message: 'University is required.' })
  @IsString({ message: 'University must be a valid text string.' })
  universite: string;

  @IsNotEmpty({ message: 'Bachelor degree title is required.' })
  @IsString({ message: 'Bachelor degree title must be a valid text string.' })
  titreLicence: string;

  @IsOptional()
  @IsString({ message: 'Master degree title must be a valid text string.' })
  titreMaster?: string;

  @IsNotEmpty({ message: 'Start year is required.' })
  @IsNumberString({}, { message: 'Start year must be a valid year.' })
  anneeDebut: string;

  @IsNotEmpty({ message: 'Bachelor graduation year is required.' })
  @IsNumberString({}, { message: 'Bachelor graduation year must be a valid year.' })
  anneeObtentionLicence: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Master graduation year must be a valid year.' })
  anneeObtentionMaster?: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required.' })
  @IsString({ message: 'Phone number must be a valid text string.' })
  telephone: string;

  @IsOptional()
  portfolio?: any; // File type - handled by multer
}
