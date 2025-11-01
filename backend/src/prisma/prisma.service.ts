import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

    async onModuleInit() {
    await this.$connect();  // Connect to PostgreSQL on startup
  }

  async onModuleDestroy() {
    await this.$disconnect();  // Cleanup on shutdown
  }
  // Add any custom methods for database operations here
}