/**
 * Partners Module DTOs and Interfaces
 * Centralized exports for all partners-related data transfer objects and types
 */

// DTOs
export { PartnerSubmissionDto } from './partner-submission.dto';

// Interfaces
export {
  PartnerSubmissionResponse,
  PartnerApplicationData,
  PartnerSubmission,
} from '../interfaces/partners.interface';

// Constants
export {
  PARTNER_TYPE,
  PARTNER_STATUS,
  SUCCESS_MESSAGES,
  LOG_MESSAGES,
} from '../constants/partners.constants';
