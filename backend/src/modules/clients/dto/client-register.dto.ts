import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class ClientRegisterDto {
  @IsNotEmpty({ message: 'Name is required. Please provide your full name.' })
  @IsString({ message: 'Name must be a valid text string.' })
  name: string;

  @IsNotEmpty({ message: 'Email is required. Please provide a valid email address.' })
  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address (e.g., user@example.com).' })
  email: string;

  @IsNotEmpty({ message: 'Password is required. Please provide a password.' })
  @IsString({ message: 'Password must be a valid text string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long. Please choose a stronger password.' })
  password: string;


}
