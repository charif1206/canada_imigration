import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalClients,
      validatedEquivalence,
      validatedResidence,
      validatedPartner,
      pendingEquivalence,
      pendingResidence,
      pendingPartner
    ] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.client.count({ where: { equivalenceStatus: 'validated' } }),
      this.prisma.client.count({ where: { residenceStatus: 'validated' } }),
      this.prisma.client.count({ where: { partnerStatus: 'validated' } }),
      this.prisma.client.count({ where: { equivalenceStatus: 'pending' } }),
      this.prisma.client.count({ where: { residenceStatus: 'pending' } }),
      this.prisma.client.count({ where: { partnerStatus: 'pending' } }),
    ]);

    return {
      totalClients,
      validatedEquivalence,
      validatedResidence,
      validatedPartner,
      pendingEquivalence,
      pendingResidence,
      pendingPartner,
    };
  }

  async getRecentClients(limit: number = 10) {
    // Get recently updated clients (any activity)
    return this.prisma.client.findMany({
      take: limit,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getAllClients(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count(),
    ]);

    return {
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingByFormType(formType: 'equivalence' | 'residence' | 'partner') {
    const whereClause: any = {};

    if (formType === 'equivalence') {
      whereClause.isSendingFormulaireEquivalence = true;
      whereClause.equivalenceStatus = 'pending';
    } else if (formType === 'residence') {
      whereClause.isSendingFormulaireResidence = true;
      whereClause.residenceStatus = 'pending';
    } else if (formType === 'partner') {
      whereClause.isSendingPartners = true;
      whereClause.partnerStatus = 'pending';
    }

    return this.prisma.client.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    });
  }

  async getRecentlyValidatedClients(limit: number = 20) {
    // Get clients with any validated form (equivalence, residence, or partner)
    const clients = await this.prisma.client.findMany({
      where: {
        OR: [
          { equivalenceStatus: 'validated' },
          { residenceStatus: 'validated' },
          { partnerStatus: 'validated' },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });

    return clients;
  }

  async getPendingValidations(limit: number = 10) {
    // Get clients with any pending form submissions
    return this.prisma.client.findMany({
      where: {
        OR: [
          { equivalenceStatus: 'pending' },
          { residenceStatus: 'pending' },
          { partnerStatus: 'pending' },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }

  async validatePendingClient(clientId: string, adminId: string, adminUsername: string) {
    this.logger.log(`Admin ${adminUsername} (${adminId}) viewing client ${clientId}`);

    // Check if client exists
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID '${clientId}' not found`);
    }

    this.logger.log(`Client ${client.name} details retrieved by ${adminUsername}`);

    return {
      message: `Client '${client.name}' details retrieved successfully`,
      client: client,
    };
  }

  async validateFormSubmission(
    clientId: string,
    formType: 'equivalence' | 'residence' | 'partner',
    status: 'validated' | 'rejected',
    reason?: string,
  ) {
    this.logger.log(`${status === 'validated' ? 'Validating' : 'Rejecting'} ${formType} form for client ${clientId}`);

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID '${clientId}' not found`);
    }

    const updateData: any = {};

    switch (formType) {
      case 'equivalence':
        updateData.equivalenceStatus = status;
        if (status === 'rejected') {
          updateData.equivalenceRejectedAt = new Date();
          updateData.equivalenceRejectionReason = reason || 'No reason provided';
        } else {
          updateData.equivalenceRejectedAt = null;
          updateData.equivalenceRejectionReason = null;
        }
        break;
      case 'residence':
        updateData.residenceStatus = status;
        if (status === 'rejected') {
          updateData.residenceRejectedAt = new Date();
          updateData.residenceRejectionReason = reason || 'No reason provided';
        } else {
          updateData.residenceRejectedAt = null;
          updateData.residenceRejectionReason = null;
        }
        break;
      case 'partner':
        updateData.partnerStatus = status;
        if (status === 'rejected') {
          updateData.partnerRejectedAt = new Date();
          updateData.partnerRejectionReason = reason || 'No reason provided';
        } else {
          updateData.partnerRejectedAt = null;
          updateData.partnerRejectionReason = null;
        }
        break;
    }

    const updatedClient = await this.prisma.client.update({
      where: { id: clientId },
      data: updateData,
    });

    this.logger.log(`${formType} form ${status} for client ${client.name}`);

    return {
      message: `${formType} form has been ${status}`,
      client: updatedClient,
    };
  }

  async getClientFormSubmission(clientId: string, formType: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID '${clientId}' not found`);
    }

    let formSubmission = null;

    if (formType === 'partner') {
      // For partner, fetch from partnerSubmission table using client's email
      formSubmission = await (this.prisma as any).partnerSubmission.findFirst({
        where: {
          data: {
            path: ['email'],
            equals: client.email,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      // Extract the data field which contains the actual submission
      if (formSubmission) {
        formSubmission = formSubmission.data;
      }
    } else {
      // For equivalence and residence, fetch from formSubmission table
      formSubmission = await (this.prisma as any).formSubmission.findFirst({
        where: {
          clientId: clientId,
          type: formType.toUpperCase(),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      // Extract the data field which contains the actual submission
      if (formSubmission) {
        formSubmission = formSubmission.data;
      }
    }

    return {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        passportNumber: client.passportNumber,
        nationality: client.nationality,
      },
      formType,
      status: formType === 'equivalence' ? (client as any).equivalenceStatus :
              formType === 'residence' ? (client as any).residenceStatus :
              (client as any).partnerStatus,
      rejectedAt: formType === 'equivalence' ? (client as any).equivalenceRejectedAt :
                  formType === 'residence' ? (client as any).residenceRejectedAt :
                  (client as any).partnerRejectedAt,
      rejectionReason: formType === 'equivalence' ? (client as any).equivalenceRejectionReason :
                       formType === 'residence' ? (client as any).residenceRejectionReason :
                       (client as any).partnerRejectionReason,
      submission: formSubmission,
    };
  }
}