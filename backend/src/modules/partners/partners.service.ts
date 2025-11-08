import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PartnerSubmissionDto } from './dto/partner-submission.dto';
import { SheetsService } from '../sheets/sheets.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class PartnersService {
  private logger = new Logger(PartnersService.name);

  constructor(
    private prisma: PrismaService,
    private sheetsService: SheetsService,
    private whatsappService: WhatsAppService,
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

    // Send to Google Sheets
    try {
      await this.sheetsService.sendDataToSheet({
        formType: 'PARTNER',
        ...partnerData,
      });
      this.logger.log('Partner application sent to Google Sheets');
    } catch (error) {
      this.logger.error('Failed to send to Google Sheets:', error);
    }

    // Send WhatsApp notification to admin
    try {
      const message = `🤝 New Partner Application!\n\nAgency: ${data.agencyName}\nManager: ${data.managerName}\nEmail: ${data.email}\nPhone: ${data.phone}\nCity: ${data.city || 'N/A'}\nMonthly Clients: ${data.clientCount || 'N/A'}\n\nMessage: ${data.message || 'N/A'}`;
      await this.whatsappService.sendMessageToAdmin(message);
      this.logger.log('Partner notification sent via WhatsApp');
    } catch (error) {
      this.logger.error('Failed to send WhatsApp notification:', error);
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
