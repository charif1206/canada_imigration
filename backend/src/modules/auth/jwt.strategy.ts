import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    }); 
  }

  async validate(payload: any) {
    // Check if payload has required fields
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload. Token is corrupted or malformed.');
    }

    // Try to find admin or client based on the type in payload
    if (payload.type === 'client') {
      const client = await this.prisma.client.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!client) {
        throw new UnauthorizedException('User account not found. Your account may have been deleted or does not exist.');
      }

      // Return with 'sub' property for compatibility with controllers
      return { 
        sub: client.id,
        id: client.id,
        name: client.name,
        email: client.email,
        type: 'client' 
      };
    }

    // Default to admin
    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin account not found. Your account may have been deleted or does not exist.');
    }

    // Return with 'sub' property for compatibility with controllers
    return { 
      sub: admin.id,
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      type: 'admin' 
    };
  }
}
