import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { EquivalenceFormDto } from './dto/equivalence-form.dto';
import { ResidenceFormDto } from './dto/residence-form.dto';
import { PartnerFormDto } from './dto/partner-form.dto';

@Injectable()
export class FormsService {
  private logger = new Logger(FormsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async submitEquivalenceForm(
    data: EquivalenceFormDto,
    file?: any, // Multer file object
    clientId?: string, // Client ID from JWT
  ) {
    this.logger.log(`Submitting equivalence form for: ${data.email}`);

    let cloudinaryUrl: string | null = null;

    // Upload file to Cloudinary if file exists
    if (file && file.path) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFromPath(
          file.path,
          'forms/equivalence',
        );
        cloudinaryUrl = uploadResult.secure_url;
        this.logger.log(`File uploaded to Cloudinary: ${cloudinaryUrl}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to upload to Cloudinary: ${errorMessage}`);
        // Continue without file if upload fails
      }
    }

    const formData = {
      type: 'EQUIVALENCE' as const,
      email: data.email,
      telephone: data.telephone,
      prenom: data.prenom,
      nom: data.nom,
      adresse: data.adresse,
      codePostal: data.codePostal,
      niveau: data.niveau,
      universite: data.universite,
      titreLicence: data.titreLicence,
      titreMaster: data.titreMaster || null,
      anneeDebut: data.anneeDebut,
      anneeObtentionLicence: data.anneeObtentionLicence,
      anneeObtentionMaster: data.anneeObtentionMaster || null,
      portfolioUrl: cloudinaryUrl,
      submittedAt: new Date(),
    };

    // Save to database if forms table exists
    try {
      // Persist to DB with client relationship
      const saved = await (this.prisma as any).formSubmission.create({
        data: {
          clientId: clientId || null,
          type: 'EQUIVALENCE',
          data: formData,
          fileUrl: cloudinaryUrl,
        },
      });
      this.logger.log(`Equivalence form persisted (id=${saved.id}, clientId=${clientId})`);
      
      // Update client's form tracking status and save folder URL
      if (clientId) {
        await this.prisma.client.update({
          where: { id: clientId },
          data: {
            isSendingFormulaireEquivalence: true,
            equivalenceStatus: 'pending',
            equivalenceRejectedAt: null,
            equivalenceRejectionReason: null,
            folderEquivalence: cloudinaryUrl,
          },
        });
        this.logger.log(`Updated client ${clientId} equivalence form status to pending with folder URL`);
      }
    } catch (error) {
      this.logger.warn('Could not save to database, continuing with notifications');
    }

    return {
      success: true,
      message: 'Equivalence form submitted successfully. We will review your application and contact you soon.',
      formId: `EQUIV-${Date.now()}`,
      status: 'pending',
    };
  }

  async submitResidenceForm(
    data: ResidenceFormDto,
    file?: any, // Multer file object
    clientId?: string, // Client ID from JWT
  ) {
    this.logger.log(`Submitting residence form for: ${data.nomComplet}`);

    let cloudinaryUrl: string | null = null;

    // Upload file to Cloudinary if file exists
    if (file && file.path) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFromPath(
          file.path,
          'forms/residence',
        );
        cloudinaryUrl = uploadResult.secure_url;
        this.logger.log(`File uploaded to Cloudinary: ${cloudinaryUrl}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to upload to Cloudinary: ${errorMessage}`);
        // Continue without file if upload fails
      }
    }

    const formData = {
      type: 'RESIDENCE' as const,
      nomComplet: data.nomComplet,
      dateNaissance: data.dateNaissance,
      paysResidence: data.paysResidence,
      programme: data.programme,
      numeroDossier: data.numeroDossier,
      etape: data.etape,
      fileUrl: cloudinaryUrl,
      submittedAt: new Date(),
    };

    // Persist residence form to DB with client relationship
    try {
      const saved = await (this.prisma as any).formSubmission.create({
        data: {
          clientId: clientId || null,
          type: 'RESIDENCE',
          data: formData,
          fileUrl: cloudinaryUrl,
        },
      });
      this.logger.log(`Residence form persisted (id=${saved.id}, clientId=${clientId})`);
      
      // Update client's form tracking status and save folder URL
      if (clientId) {
        await this.prisma.client.update({
          where: { id: clientId },
          data: {
            isSendingFormulaireResidence: true,
            residenceStatus: 'pending',
            residenceRejectedAt: null,
            residenceRejectionReason: null,
            folderResidence: cloudinaryUrl,
          },
        });
        this.logger.log(`Updated client ${clientId} residence form status to pending with folder URL`);
      }
    } catch (error) {
      this.logger.warn('Could not save residence form to database, continuing');
    }

    return {
      success: true,
      message: 'Residence form submitted successfully. We will process your application and contact you soon.',
      formId: `RESID-${Date.now()}`,
      status: 'pending',
    };
  }

  async submitPartnerForm(
    data: PartnerFormDto,
    clientId?: string,
  ) {
    this.logger.log(`Submitting partner form for: ${data.agencyName}`);

    const formData = {
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

    // Persist partner form to DB with client relationship
    try {
      const saved = await (this.prisma as any).formSubmission.create({
        data: {
          clientId: clientId || null,
          type: 'PARTNER',
          data: formData,
          fileUrl: null,
        },
      });
      this.logger.log(`Partner form persisted (id=${saved.id}, clientId=${clientId})`);
      
      // Update client's form tracking status
      if (clientId) {
        await this.prisma.client.update({
          where: { id: clientId },
          data: {
            isSendingPartners: true,
            partnerStatus: 'pending',
            partnerRejectedAt: null,
            partnerRejectionReason: null,
          },
        });
        this.logger.log(`Updated client ${clientId} partner form status to pending`);
      }
    } catch (error) {
      this.logger.warn('Could not save partner form to database, continuing');
    }

    return {
      success: true,
      message: 'Partner application submitted successfully. We will contact you within 24 hours.',
      formId: `PARTNER-${Date.now()}`,
      status: 'pending',
    };
  }

  async getAllForms() {
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
      this.logger.error('Failed to fetch forms:', error);
      return [];
    }
  }

  async getFormById(id: string) {
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
      this.logger.error(`Failed to fetch form ${id}:`, error);
      return null;
    }
  }
}
