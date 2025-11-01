import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty({ message: 'Username is required. Please provide an admin username.' })
  @IsString({ message: 'Username must be a valid text string.' })
  username: string;

  @IsNotEmpty({ message: 'Password is required. Please provide a password.' })
  @IsString({ message: 'Password must be a valid text string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long for security. Please choose a stronger password.' })
  password: string;

  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address (e.g., admin@example.com).' })
  @IsNotEmpty({ message: 'Email is required. Please provide an email address.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Role must be a valid text string.' })
  role?: string;
}
