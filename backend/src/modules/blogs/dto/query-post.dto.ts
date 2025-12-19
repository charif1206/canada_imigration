import { IsOptional, IsNumberString } from 'class-validator';

export class QueryPostDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  published?: string;
}
