import { Injectable, UnauthorizedException, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Create default admin if not exists
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      const username = this.configService.get<string>('ADMIN_DEFAULT_USERNAME') || 'admin';
      
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { username },
      });

      if (!existingAdmin) {
        const password = this.configService.get<string>('ADMIN_DEFAULT_PASSWORD') || 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.admin.create({
          data: {
            username,
            password: hashedPassword,
            email: 'admin@immigration.com',
            role: 'admin',
          },
        });

        this.logger.log(`✅ Default admin created: ${username}`);
        this.logger.warn(`⚠️ Please change the default password immediately!`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create default admin: ${errorMessage}`);
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = admin;
    return result;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateUser(loginDto.username, loginDto.password);

    const payload = {
      username: admin.username,
      sub: admin.id,
      role: admin.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async changePassword(adminId: string, oldPassword: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    this.logger.log(`Password changed for admin: ${admin.username}`);

    return { message: 'Password changed successfully' };
  }

  async getProfile(adminId: string) {
    return this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async register(registerDto: { username: string; password: string; email: string; role?: string }) {
    // Check if username already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { username: registerDto.username },
    });

    if (existingAdmin) {
      throw new UnauthorizedException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.prisma.admin.findFirst({
      where: { email: registerDto.email },
    });

    if (existingEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new admin
    const newAdmin = await this.prisma.admin.create({
      data: {
        username: registerDto.username,
        password: hashedPassword,
        email: registerDto.email,
        role: registerDto.role || 'admin',
      },
    });

    this.logger.log(`✅ New admin created: ${newAdmin.username}`);

    const { password: _, ...adminWithoutPassword } = newAdmin;
    return adminWithoutPassword;
  }
}
