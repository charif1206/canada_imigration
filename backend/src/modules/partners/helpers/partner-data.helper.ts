import { PartnerApplicationData } from '../interfaces/partners.interface';
import { PartnerSubmissionDto } from '../dto/partner-submission.dto';
import { PARTNER_TYPE } from '../constants/partners.constants';

/**
 * Create partner application data object
 * @param dto - Partner submission DTO
 * @returns Formatted partner application data
 */
export function createPartnerApplicationData(
  dto: PartnerSubmissionDto,
): PartnerApplicationData {
  return {
    type: PARTNER_TYPE,
    agencyName: dto.agencyName,
    managerName: dto.managerName,
    email: dto.email,
    phone: dto.phone,
    address: dto.address || null,
    city: dto.city || null,
    clientCount: dto.clientCount || null,
    message: dto.message || null,
    submittedAt: new Date(),
  };
}

/**
 * Generate partner application ID
 * @returns Unique application ID
 */
export function generateApplicationId(): string {
  return `PARTNER-${Date.now()}`;
}
