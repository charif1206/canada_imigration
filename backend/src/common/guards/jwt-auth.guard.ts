import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Handle different JWT errors with descriptive messages
    if (info) {
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Your session has expired. Please log in again to continue.');
      }
      if (info.name === 'JsonWebTokenError') {
        if (info.message.includes('jwt malformed')) {
          throw new UnauthorizedException('Invalid access token format. The token is corrupted or malformed. Please log in again.');
        }
        if (info.message.includes('jwt must be provided')) {
          throw new UnauthorizedException('Access token is required. Please provide a valid token in the Authorization header.');
        }
        if (info.message.includes('invalid signature')) {
          throw new UnauthorizedException('Invalid token signature. The token has been tampered with or is from a different system. Please log in again.');
        }
        throw new UnauthorizedException('Invalid access token. Please log in again to get a new token.');
      }
      if (info.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet. Please wait or log in again.');
      }
    }

    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('Authentication required. Please provide a valid access token in the Authorization header.');
    }

    return user;
  }
}
