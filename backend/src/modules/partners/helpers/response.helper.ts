import { PartnerSubmissionResponse } from '../interfaces/partners.interface';
import { SUCCESS_MESSAGES } from '../constants/partners.constants';
import { generateApplicationId } from './partner-data.helper';

/**
 * Create partner submission success response
 * @returns Formatted success response
 */
export function createPartnerSubmissionResponse(): PartnerSubmissionResponse {
  return {
    success: true,
    message: SUCCESS_MESSAGES.PARTNER_SUBMITTED,
    applicationId: generateApplicationId(),
  };
}
