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
      where: { isValidated: true },
      take: limit,
      orderBy: { validatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getPendingValidations(limit: number = 10) {
    return this.prisma.client.findMany({
      where: { isValidated: false },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }

  async validatePendingClient(clientId: string, adminId: string, adminUsername: string) {
    this.logger.log(`Admin ${adminUsername} (${adminId}) validating client ${clientId}`);

    // Check if client exists and is not already validated
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID '${clientId}' not found`);
    }

    if (client.isValidated) {
      throw new Error(`Client '${client.name}' is already validated`);
    }

    // Update client to validated
    const updatedClient = await this.prisma.client.update({
      where: { id: clientId },
      data: {
        isValidated: true,
        validatedAt: new Date(),
        validatedBy: adminUsername,
      },
    });

    this.logger.log(`Client ${client.name} successfully validated by ${adminUsername}`);

    return {
      message: `Client '${client.name}' has been successfully validated`,
      client: updatedClient,
    };
  }
}