import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PartnerSubmissionDto } from './dto/partner-submission.dto';
import {
  PartnerSubmissionResponse,
  PartnerSubmission,
  PartnerApplicationData,
} from './interfaces/partners.interface';
import {
  createPartnerApplicationData,
} from './helpers/partner-data.helper';
import { updateClientPartnerStatus } from './helpers/client-update.helper';
import { createPartnerSubmissionResponse } from './helpers/response.helper';
import { formatLogMessage } from './helpers/log.helper';
import {
  PARTNER_TYPE,
  LOG_MESSAGES,
} from './constants/partners.constants';

/**
 * Partners Service
 * Handles partner application submissions and retrieval
 * Follows Single Responsibility Principle with helper functions for specific tasks
 */
@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ========================================
  // PARTNER APPLICATION SUBMISSION
  // ========================================

  /**
   * Submit partner application
   * @param data - Partner submission data
   * @param clientId - Client ID from JWT (optional)
   * @returns Partner submission response
   */
  async submitPartnerApplication(
    data: PartnerSubmissionDto,
    clientId?: string,
  ): Promise<PartnerSubmissionResponse> {
    this.logger.log(
      formatLogMessage(LOG_MESSAGES.APPLICATION_SUBMITTED, {
        agencyName: data.agencyName,
      }),
    );

    // Create partner application data
    const partnerData = createPartnerApplicationData(data);

    // Persist to database
    await this.persistPartnerApplication(partnerData);

    // Update client status if client ID provided
    if (clientId) {
      await this.updateClientPartner(clientId);
    }

    return createPartnerSubmissionResponse();
  }

  // ========================================
  // PARTNER RETRIEVAL
  // ========================================

  /**
   * Get all partner submissions
   * @returns Array of partner submissions
   */
  async getAllPartners(): Promise<PartnerSubmission[]> {
    try {
      const partners = await (this.prisma as any).partnerSubmission.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return partners;
    } catch (error) {
      this.logger.error(LOG_MESSAGES.FETCH_PARTNERS_FAILED, error);
      return [];
    }
  }

  /**
   * Get single partner submission by ID
   * @param id - Partner submission ID
   * @returns Partner submission or null
   */
  async getPartnerById(id: string): Promise<PartnerSubmission | null> {
    try {
      const partner = await (this.prisma as any).partnerSubmission.findUnique({
        where: { id },
      });
      return partner;
    } catch (error) {
      this.logger.error(
        formatLogMessage(LOG_MESSAGES.FETCH_PARTNER_FAILED, { id }),
        error,
      );
      return null;
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Persist partner application to database
   */
  private async persistPartnerApplication(
    partnerData: PartnerApplicationData,
  ): Promise<void> {
    try {
      const saved = await (this.prisma as any).partnerSubmission.create({
        data: {
          type: PARTNER_TYPE,
          data: partnerData,
        },
      });

      this.logger.log(
        formatLogMessage(LOG_MESSAGES.APPLICATION_PERSISTED, {
          id: saved.id,
        }),
      );
    } catch (error) {
      this.logger.warn(LOG_MESSAGES.DATABASE_SAVE_FAILED, error);
    }
  }

  /**
   * Update client partner application status
   */
  private async updateClientPartner(clientId: string): Promise<void> {
    try {
      await updateClientPartnerStatus(this.prisma, clientId);
    } catch (error) {
      this.logger.warn(
        `Failed to update client ${clientId} partner status`,
        error,
      );
    }
  }
}
