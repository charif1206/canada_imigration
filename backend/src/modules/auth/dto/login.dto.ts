import { IsNotEmpty, IsString } from 'class-validator';

//change it to email login later
export class LoginDto {
  @IsNotEmpty({ message: 'Username is required. Please provide your admin username.' })
  @IsString({ message: 'Username must be a valid text string.' })
  username: string;

  @IsNotEmpty({ message: 'Password is required. Please provide your admin password.' })
  @IsString({ message: 'Password must be a valid text string.' })
  password: string;
}
