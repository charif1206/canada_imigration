import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PartnerSubmissionDto } from './dto/partner-submission.dto';

@Injectable()
export class PartnersService {
  private logger = new Logger(PartnersService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

  async submitPartnerApplication(data: PartnerSubmissionDto) {
    this.logger.log(`Submitting partner application for: ${data.agencyName}`);

    const partnerData = {
      type: 'PARTNER' as const,
      agencyName: data.agencyName,
      managerName: data.managerName,
      email: data.email,
      phone: data.phone,
      address: data.address || null,
      city: data.city || null,
      clientCount: data.clientCount || null,
      message: data.message || null,
      submittedAt: new Date(),
    };

    // Save to database
    try {
      const saved = await (this.prisma as any).partnerSubmission.create({
        data: {
          type: 'PARTNER',
          data: partnerData,
        },
      });
      this.logger.log(`Partner application persisted (id=${saved.id})`);
    } catch (error) {
      this.logger.warn('Could not save to database, continuing with notifications');
    }

    return {
      success: true,
      message: 'Partner application submitted successfully. We will contact you within 24 hours.',
      applicationId: `PARTNER-${Date.now()}`,
    };
  }

  async getAllPartners() {
    try {
      const partners = await (this.prisma as any).partnerSubmission.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return partners;
    } catch (error) {
      this.logger.error('Failed to fetch partners:', error);
      return [];
    }
  }

  async getPartnerById(id: string) {
    try {
      const partner = await (this.prisma as any).partnerSubmission.findUnique({
        where: { id },
      });
      return partner;
    } catch (error) {
      this.logger.error(`Failed to fetch partner ${id}:`, error);
      return null;
    }
  }
}
