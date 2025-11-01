import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'Client ID is required. Please provide a valid client ID.' })
  @IsString({ message: 'Client ID must be a valid text string.' })
  clientId: string;

  @IsNotEmpty({ message: 'Subject is required. Please provide a subject for your message.' })
  @IsString({ message: 'Subject must be a valid text string.' })
  subject: string;

  @IsNotEmpty({ message: 'Message content is required. Please provide your message.' })
  @IsString({ message: 'Message content must be a valid text string.' })
  content: string;
}
