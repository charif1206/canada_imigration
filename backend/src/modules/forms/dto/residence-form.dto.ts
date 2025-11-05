import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class ResidenceFormDto {
  @IsNotEmpty({ message: 'Full name is required.' })
  @IsString({ message: 'Full name must be a valid text string.' })
  nomComplet: string;

  @IsNotEmpty({ message: 'Date of birth is required.' })
  @IsString({ message: 'Date of birth must be a valid date.' })
  dateNaissance: string;

  @IsNotEmpty({ message: 'Country of residence is required.' })
  @IsString({ message: 'Country of residence must be a valid text string.' })
  paysResidence: string;

  @IsNotEmpty({ message: 'Program is required.' })
  @IsString({ message: 'Program must be a valid text string.' })
  programme: string;

  @IsNotEmpty({ message: 'Application number is required.' })
  @IsString({ message: 'Application number must be a valid text string.' })
  numeroDossier: string;

  @IsNotEmpty({ message: 'Process step is required.' })
  @IsString({ message: 'Process step must be a valid text string.' })
  etape: string;

  @IsOptional()
  fileUpload?: any; // File type will be handled by multer
}
