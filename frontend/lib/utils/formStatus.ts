// Form status helper utilities

export type FormType = 'equivalence' | 'residence' | 'partner';

export interface FormStatusResult {
  canSubmit: boolean;
  message: string;
  messageType: 'success' | 'warning' | 'error' | 'info';
}

export interface User {
  isSendingFormulaireEquivalence?: boolean;
  equivalenceStatus?: string | null;
  equivalenceRejectedAt?: string | null;
  
  isSendingFormulaireResidence?: boolean;
  residenceStatus?: string | null;
  residenceRejectedAt?: string | null;
  
  isSendingPartners?: boolean;
  partnerStatus?: string | null;
  partnerRejectedAt?: string | null;
}

/**
 * Check if user can submit a specific form
 * Returns status message and whether submission is allowed
 */
export function checkFormStatus(user: User | null, formType: FormType): FormStatusResult {
  if (!user) {
    return {
      canSubmit: true,
      message: '',
      messageType: 'info',
    };
  }

  let isSending = false;
  let status: string | null | undefined = null;
  let rejectedAt: string | null | undefined = null;

  // Get form-specific fields
  switch (formType) {
    case 'equivalence':
      isSending = user.isSendingFormulaireEquivalence || false;
      status = user.equivalenceStatus;
      rejectedAt = user.equivalenceRejectedAt;
      break;
    case 'residence':
      isSending = user.isSendingFormulaireResidence || false;
      status = user.residenceStatus;
      rejectedAt = user.residenceRejectedAt;
      break;
    case 'partner':
      isSending = user.isSendingPartners || false;
      status = user.partnerStatus;
      rejectedAt = user.partnerRejectedAt;
      break;
  }

  // If user already sent and it's pending
  if (isSending && status === 'pending') {
    return {
      canSubmit: false,
      message: '⏳ Your application is pending review. We will notify you once it has been processed.',
      messageType: 'warning',
    };
  }

  // If validated
  if (status === 'validated') {
    return {
      canSubmit: false,
      message: '✅ Your application has been verified and approved!',
      messageType: 'success',
    };
  }

  // If rejected - check if 24 hours have passed
  if (status === 'rejected' && rejectedAt) {
    const rejectionDate = new Date(rejectedAt);
    const now = new Date();
    const hoursSinceRejection = (now.getTime() - rejectionDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceRejection < 24) {
      const hoursRemaining = Math.ceil(24 - hoursSinceRejection);
      return {
        canSubmit: false,
        message: `❌ Your application was rejected. You can resubmit after ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}.`,
        messageType: 'error',
      };
    }
  }

  // Can submit (either first time or 24 hours after rejection)
  return {
    canSubmit: true,
    message: '',
    messageType: 'info',
  };
}

/**
 * Get form title based on type
 */
export function getFormTitle(formType: FormType): string {
  switch (formType) {
    case 'equivalence':
      return 'Equivalence Application';
    case 'residence':
      return 'Residence Application';
    case 'partner':
      return 'Partner Application';
  }
}
