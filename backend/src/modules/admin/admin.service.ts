import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalClients, validatedClients, pendingClients, unreadMessages] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.client.count({ where: { isValidated: true } }),
      this.prisma.client.count({ where: { isValidated: false } }),
      this.prisma.message.count({ where: { isRead: false } }),
    ]);

    return {
      totalClients,
      validatedClients,
      pendingClients,
      unreadMessages,
    };
  }

  async getAllMessages() {
    return this.prisma.message.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async getRecentClients(limit: number = 10) {
    return this.prisma.client.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getPendingValidations() {
    return this.prisma.client.findMany({
      where: { isValidated: false },
      orderBy: { createdAt: 'asc' },
    });
  }
}