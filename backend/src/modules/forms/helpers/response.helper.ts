import { FormSubmissionResponse, FormType } from '../interfaces/forms.interface';
import { SUCCESS_MESSAGES, FORM_STATUS } from '../constants/forms.constants';
import { generateFormId } from './form-data.helper';

/**
 * Create form submission success response
 * @param formType - Type of form submitted
 * @returns Formatted success response
 */
export function createFormSubmissionResponse(formType: FormType): FormSubmissionResponse {
  const messageMap: Record<FormType, string> = {
    EQUIVALENCE: SUCCESS_MESSAGES.EQUIVALENCE_SUBMITTED,
    RESIDENCE: SUCCESS_MESSAGES.RESIDENCE_SUBMITTED,
    PARTNER: SUCCESS_MESSAGES.PARTNER_SUBMITTED,
  };

  return {
    success: true,
    message: messageMap[formType],
    formId: generateFormId(formType),
    status: FORM_STATUS.PENDING,
  };
}
