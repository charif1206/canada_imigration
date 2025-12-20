'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FormSection, FormStatusDisplay, ResubmissionWarning } from '@/components/forms';
import { FormulaireResidence } from '@/components/forms/FormulaireResidence';
import { BackToFormsLink } from '@/components/forms/BackToFormsLink';
import { FormPageHeader } from '@/components/forms/FormPageHeader';
import { useFormState } from '@/lib/hooks/useFormState';
import { FORM_TYPES, FORM_METADATA } from '@/lib/constants/forms.constants';

/**
 * Residence Form Page
 * Handles permanent residence form submission and status display
 */
const ResidenceFormPage: React.FC = () => {
  const {
    isSendingTemporarily,
    canResubmit,
    isFormSending,
    formStatus,
    rejectedAt,
    rejectionReason,
    handleFormSubmit,
  } = useFormState(FORM_TYPES.RESIDENCE);

  const metadata = FORM_METADATA.residence;
  const shouldShowForm = canResubmit && !isSendingTemporarily;
  const shouldShowStatus = (isFormSending && !canResubmit) || isSendingTemporarily;

  return (
    <ProtectedRoute>
      <div className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <BackToFormsLink />

          {/* Page Header */}
          <FormPageHeader
            icon={metadata.icon}
            title={`Formulaire ${metadata.title}`}
            description={metadata.description}
          />

          {/* Form Content */}
          <FormSection id="residence" title="" subtitle="">
            {shouldShowStatus ? (
              <FormStatusDisplay
                status={isSendingTemporarily ? 'pending' : formStatus}
                rejectedAt={rejectedAt}
                rejectionReason={rejectionReason}
                formTitle={`Formulaire ${metadata.title}`}
              />
            ) : (
              <>
                {formStatus === 'rejected' && canResubmit && (
                  <ResubmissionWarning />
                )}
                <FormulaireResidence onSubmitSuccess={handleFormSubmit} />
              </>
            )}
          </FormSection>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ResidenceFormPage;
