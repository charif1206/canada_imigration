import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { EquivalenceFormDto } from './dto/equivalence-form.dto';
import { ResidenceFormDto } from './dto/residence-form.dto';
import { PartnerFormDto } from './dto/partner-form.dto';
import {
  FormSubmissionResponse,
  FormSubmission,
  EquivalenceFormData,
  ResidenceFormData,
  PartnerFormData,
} from './interfaces/forms.interface';
import {
  uploadFileToCloudinary,
  formatLogMessage,
} from './helpers/file-upload.helper';
import {
  createEquivalenceFormData,
  createResidenceFormData,
  createPartnerFormData,
} from './helpers/form-data.helper';
import {
  updateClientEquivalenceStatus,
  updateClientResidenceStatus,
  updateClientPartnerStatus,
} from './helpers/client-update.helper';
import { createFormSubmissionResponse } from './helpers/response.helper';
import {
  FORM_TYPES,
  CLOUDINARY_FOLDERS,
  LOG_MESSAGES,
} from './constants/forms.constants';

/**
 * Forms Service
 * Handles form submission, file uploads, and database persistence
 * Follows Single Responsibility Principle with helper functions for specific tasks
 */
@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ========================================
  // EQUIVALENCE FORM
  // ========================================

  /**
   * Submit equivalence form with optional file upload
   * @param data - Equivalence form data
   * @param file - Multer file object (optional)
   * @param clientId - Client ID from JWT (optional)
   * @returns Form submission response
   */
  async submitEquivalenceForm(
    data: EquivalenceFormDto,
    file?: any,
    clientId?: string,
  ): Promise<FormSubmissionResponse> {
    this.logger.log(
      formatLogMessage(LOG_MESSAGES.FORM_SUBMITTED, {
        type: FORM_TYPES.EQUIVALENCE,
        identifier: data.email,
      }),
    );

    // Upload file to Cloudinary if provided
    const uploadResult = await uploadFileToCloudinary(
      file,
      this.cloudinaryService,
      CLOUDINARY_FOLDERS.EQUIVALENCE,
    );

    // Create form data
    const formData = createEquivalenceFormData(data, uploadResult.url);

    // Persist to database
    await this.persistEquivalenceForm(formData, uploadResult.url, clientId);

    // Update client status if client ID provided
    if (clientId) {
      await this.updateClientEquivalence(clientId, uploadResult.url);
    }

    return createFormSubmissionResponse(FORM_TYPES.EQUIVALENCE);
  }

  // ========================================
  // RESIDENCE FORM
  // ========================================

  /**
   * Submit residence form with optional file upload
   * @param data - Residence form data
   * @param file - Multer file object (optional)
   * @param clientId - Client ID from JWT (optional)
   * @returns Form submission response
   */
  async submitResidenceForm(
    data: ResidenceFormDto,
    file?: any,
    clientId?: string,
  ): Promise<FormSubmissionResponse> {
    this.logger.log(
      formatLogMessage(LOG_MESSAGES.FORM_SUBMITTED, {
        type: FORM_TYPES.RESIDENCE,
        identifier: data.nomComplet,
      }),
    );

    // Upload file to Cloudinary if provided
    const uploadResult = await uploadFileToCloudinary(
      file,
      this.cloudinaryService,
      CLOUDINARY_FOLDERS.RESIDENCE,
    );

    // Create form data
    const formData = createResidenceFormData(data, uploadResult.url);

    // Persist to database
    await this.persistResidenceForm(formData, uploadResult.url, clientId);

    // Update client status if client ID provided
    if (clientId) {
      await this.updateClientResidence(clientId, uploadResult.url);
    }

    return createFormSubmissionResponse(FORM_TYPES.RESIDENCE);
  }

  // ========================================
  // PARTNER FORM
  // ========================================

  /**
   * Submit partner form (no file upload)
   * @param data - Partner form data
   * @param clientId - Client ID from JWT (optional)
   * @returns Form submission response
   */
  async submitPartnerForm(
    data: PartnerFormDto,
    clientId?: string,
  ): Promise<FormSubmissionResponse> {
    this.logger.log(
      formatLogMessage(LOG_MESSAGES.FORM_SUBMITTED, {
        type: FORM_TYPES.PARTNER,
        identifier: data.agencyName,
      }),
    );

    // Create form data
    const formData = createPartnerFormData(data);

    // Persist to database
    await this.persistPartnerForm(formData, clientId);

    // Update client status if client ID provided
    if (clientId) {
      await this.updateClientPartner(clientId);
    }

    return createFormSubmissionResponse(FORM_TYPES.PARTNER);
  }

  // ========================================
  // FORM RETRIEVAL
  // ========================================

  /**
   * Get all form submissions with client information
   * @returns Array of form submissions
   */
  async getAllForms(): Promise<FormSubmission[]> {
    try {
      const forms = await (this.prisma as any).formSubmission.findMany({
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              passportNumber: true,
              nationality: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return forms;
    } catch (error) {
      this.logger.error(LOG_MESSAGES.FETCH_FORMS_FAILED, error);
      return [];
    }
  }

  /**
   * Get single form submission by ID
   * @param id - Form submission ID
   * @returns Form submission or null
   */
  async getFormById(id: string): Promise<FormSubmission | null> {
    try {
      const form = await (this.prisma as any).formSubmission.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              passportNumber: true,
              nationality: true,
              isEmailVerified: true,
              createdAt: true,
            },
          },
        },
      });
      return form;
    } catch (error) {
      this.logger.error(
        formatLogMessage(LOG_MESSAGES.FETCH_FORM_FAILED, { id }),
        error,
      );
      return null;
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Persist equivalence form to database
   */
  private async persistEquivalenceForm(
    formData: EquivalenceFormData,
    fileUrl: string | null,
    clientId?: string,
  ): Promise<void> {
    try {
      const saved = await (this.prisma as any).formSubmission.create({
        data: {
          clientId: clientId || null,
          type: FORM_TYPES.EQUIVALENCE,
          data: formData,
          fileUrl: fileUrl,
        },
      });

      this.logger.log(
        formatLogMessage(LOG_MESSAGES.FORM_PERSISTED, {
          type: FORM_TYPES.EQUIVALENCE,
          id: saved.id,
          clientId: clientId || 'none',
        }),
      );
    } catch (error) {
      this.logger.warn(
        formatLogMessage(LOG_MESSAGES.DATABASE_SAVE_FAILED, {
          type: FORM_TYPES.EQUIVALENCE,
        }),
      );
    }
  }

  /**
   * Persist residence form to database
   */
  private async persistResidenceForm(
    formData: ResidenceFormData,
    fileUrl: string | null,
    clientId?: string,
  ): Promise<void> {
    try {
      const saved = await (this.prisma as any).formSubmission.create({
        data: {
          clientId: clientId || null,
          type: FORM_TYPES.RESIDENCE,
          data: formData,
          fileUrl: fileUrl,
        },
      });

      this.logger.log(
        formatLogMessage(LOG_MESSAGES.FORM_PERSISTED, {
          type: FORM_TYPES.RESIDENCE,
          id: saved.id,
          clientId: clientId || 'none',
        }),
      );
    } catch (error) {
      this.logger.warn(
        formatLogMessage(LOG_MESSAGES.DATABASE_SAVE_FAILED, {
          type: FORM_TYPES.RESIDENCE,
        }),
      );
    }
  }

  /**
   * Persist partner form to database
   */
  private async persistPartnerForm(
    formData: PartnerFormData,
    clientId?: string,
  ): Promise<void> {
    try {
      const saved = await (this.prisma as any).formSubmission.create({
        data: {
          clientId: clientId || null,
          type: FORM_TYPES.PARTNER,
          data: formData,
          fileUrl: null,
        },
      });

      this.logger.log(
        formatLogMessage(LOG_MESSAGES.FORM_PERSISTED, {
          type: FORM_TYPES.PARTNER,
          id: saved.id,
          clientId: clientId || 'none',
        }),
      );
    } catch (error) {
      this.logger.warn(
        formatLogMessage(LOG_MESSAGES.DATABASE_SAVE_FAILED, {
          type: FORM_TYPES.PARTNER,
        }),
      );
    }
  }

  /**
   * Update client equivalence form status
   */
  private async updateClientEquivalence(
    clientId: string,
    fileUrl: string | null,
  ): Promise<void> {
    try {
      await updateClientEquivalenceStatus(this.prisma, clientId, fileUrl);
    } catch (error) {
      this.logger.warn(
        `Failed to update client ${clientId} equivalence status`,
        error,
      );
    }
  }

  /**
   * Update client residence form status
   */
  private async updateClientResidence(
    clientId: string,
    fileUrl: string | null,
  ): Promise<void> {
    try {
      await updateClientResidenceStatus(this.prisma, clientId, fileUrl);
    } catch (error) {
      this.logger.warn(
        `Failed to update client ${clientId} residence status`,
        error,
      );
    }
  }

  /**
   * Update client partner form status
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
