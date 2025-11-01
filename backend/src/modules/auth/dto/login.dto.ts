import { IsNotEmpty, IsString } from 'class-validator';

//change it to email login later
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
