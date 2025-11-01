import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClientLoginDto {
  @IsNotEmpty({ message: 'Email is required. Please provide your email address.' })
  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address (e.g., user@example.com).' })
  email: string;

  @IsNotEmpty({ message: 'Password is required. Please provide your password.' })
  @IsString({ message: 'Password must be a valid text string.' })
  password: string;
}
