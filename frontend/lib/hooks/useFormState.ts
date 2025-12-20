/**
 * Form State Hook
 * Manages form submission state, including temporary states and resubmission logic
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { FormType, FORM_METADATA, RESUBMISSION_CONFIG } from '../constants/forms.constants';
import { canResubmitForm } from '../utils/formTime.utils';
import {
  getTempSendingState,
  setTempSendingState,
  removeTempSendingState,
  cleanupOldTempStates,
} from '../utils/formStorage.utils';

export interface FormStateReturn {
  isSendingTemporarily: boolean;
  canResubmit: boolean;
  isFormSending: boolean;
  formStatus: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  handleFormSubmit: () => Promise<void>;
}

/**
 * Hook to manage form state and submission logic
 * @param formType - Type of form (equivalence, residence, partner)
 * @returns Form state and handlers
 */
export function useFormState(formType: FormType): FormStateReturn {
  const { client, refreshAuth } = useAuth();
  
  const metadata = FORM_METADATA[formType];
  const clientData = client as any;

  // Initialize temporary sending state from localStorage
  const [isSendingTemporarily, setIsSendingTemporarily] = useState(() => 
    getTempSendingState(formType, client?.id)
  );

  // Clean up old localStorage entries and sync with backend state
  useEffect(() => {
    if (!client?.id) return;

    // Clean up old entries for other clients
    cleanupOldTempStates(formType, client.id);

    // Sync temporary state with backend state
    const isFormSending = clientData?.[metadata.sendingKey];
    const status = clientData?.[metadata.statusKey];

    if (isSendingTemporarily && isFormSending) {
      // Check if form has been processed (validated or rejected)
      if (status === 'validated' || status === 'rejected') {
        removeTempSendingState(formType, client.id);
        setIsSendingTemporarily(false);
      }
    }
  }, [
    client?.id,
    formType,
    metadata.sendingKey,
    metadata.statusKey,
    clientData,
    isSendingTemporarily,
  ]);

  // Periodic refresh of auth state
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAuth();
    }, RESUBMISSION_CONFIG.REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refreshAuth]);

  // Handle form submission
  const handleFormSubmit = async () => {
    if (!client?.id) return;

    setTempSendingState(formType, client.id, true);
    setIsSendingTemporarily(true);
    
    // Scroll to top to show status
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Refresh auth to get updated state
    await refreshAuth();
  };

  // Calculate resubmission eligibility
  const status = clientData?.[metadata.statusKey] || null;
  const rejectedAt = clientData?.[metadata.rejectedAtKey] || null;
  const rejectionReason = clientData?.[metadata.rejectionReasonKey] || null;
  const isFormSending = clientData?.[metadata.sendingKey] || false;
  const canResubmit = canResubmitForm(status, rejectedAt);

  return {
    isSendingTemporarily,
    canResubmit,
    isFormSending,
    formStatus: status,
    rejectedAt,
    rejectionReason,
    handleFormSubmit,
  };
}
