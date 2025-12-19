/**
 * Forms Module DTOs and Interfaces
 * Centralized exports for all forms-related data transfer objects and types
 */

// DTOs
export { EquivalenceFormDto } from './equivalence-form.dto';
export { ResidenceFormDto } from './residence-form.dto';
export { PartnerFormDto } from './partner-form.dto';

// Interfaces
export {
  FormType,
  FormStatus,
  FormSubmissionResponse,
  FileUploadResult,
  FormClientInfo,
  EquivalenceFormData,
  ResidenceFormData,
  PartnerFormData,
  FormSubmission,
  ClientFormUpdateData,
} from '../interfaces/forms.interface';

// Constants
export {
  FORM_TYPES,
  FORM_STATUS,
  CLOUDINARY_FOLDERS,
  FILE_UPLOAD_CONFIG,
  SUCCESS_MESSAGES,
  LOG_MESSAGES,
  CLIENT_UPDATE_FIELDS,
} from '../constants/forms.constants';
