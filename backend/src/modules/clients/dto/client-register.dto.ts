import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ClientRegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsString()
  immigrationType?: string;
}
