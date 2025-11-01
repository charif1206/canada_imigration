import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Get the original error message
    const exceptionResponse: any = exception.getResponse();
    const originalMessage = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : exceptionResponse.message;

    // Determine the specific error message based on context
    let message: string;

    // Check if Authorization header exists
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      message = 'Authentication required. Please provide a valid access token in the Authorization header.';
    } else if (!authHeader.startsWith('Bearer ')) {
      message = 'Invalid authorization format. Please use "Bearer <token>" format in the Authorization header.';
    } else {
      const token = authHeader.substring(7);
      
      if (!token || token === 'null' || token === 'undefined') {
        message = 'Access token is missing. Please log in to get a valid token.';
      } else if (token.split('.').length !== 3) {
        message = 'Malformed access token. The token format is invalid. Please log in again to get a new token.';
      } else if (originalMessage.includes('jwt expired')) {
        message = 'Your session has expired. Please log in again to continue.';
      } else if (originalMessage.includes('jwt malformed')) {
        message = 'Invalid access token format. The token is corrupted or malformed. Please log in again.';
      } else if (originalMessage.includes('invalid signature')) {
        message = 'Invalid token signature. The token has been tampered with or is from a different system. Please log in again.';
      } else if (originalMessage.includes('jwt must be provided')) {
        message = 'Access token is required. Please provide a valid token in the Authorization header.';
      } else if (originalMessage.includes('not found')) {
        message = 'User account not found. Your account may have been deleted. Please contact support or register again.';
      } else if (originalMessage.includes('invalid token')) {
        message = 'Invalid access token. Please log in again to get a new token.';
      } else {
        // Generic but better than just "Unauthorized"
        message = 'Authentication failed. Your token is invalid or expired. Please log in again.';
      }
    }

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
