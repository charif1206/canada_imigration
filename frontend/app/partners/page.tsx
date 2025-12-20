'use client';

import React, { useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageHeader, PartnerApplicationForm, ResubmitNotice } from '@/components/partners';
import { PartnerBenefitsGrid } from '@/components/partners/PartnerBenefitsGrid';
import { PartnerStatusCard } from '@/components/partners/PartnerStatusCard';
import { usePartnerState } from '@/lib/hooks/usePartnerState';
import { PARTNER_CONTENT } from '@/lib/constants/partners.constants';

/**
 * Partners Page
 * Displays partner program information and application form
 */
const PartnersPage: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const {
    partnerStatus,
    partnerRejectedAt,
    partnerRejectionReason,
    canResubmit,
    shouldShowForm,
  } = usePartnerState();

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ProtectedRoute>
      <div className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <PageHeader
            title={PARTNER_CONTENT.PAGE_TITLE}
            subtitle={PARTNER_CONTENT.PAGE_SUBTITLE}
          />

          {/* Status Display or Form */}
          {!shouldShowForm ? (
            <PartnerStatusCard
              status={partnerStatus}
              rejectedAt={partnerRejectedAt}
              rejectionReason={partnerRejectionReason}
            />
          ) : (
            <>
              {/* Resubmit Notice */}
              {partnerStatus === 'rejected' && canResubmit && (
                <ResubmitNotice canResubmit={canResubmit} />
              )}

              {/* Benefits Section */}
              <PartnerBenefitsGrid onScrollToForm={handleScrollToForm} />

              {/* Application Form */}
              <div ref={formRef} className="mt-12 sm:mt-16 max-w-4xl mx-auto scroll-mt-24">
                <PartnerApplicationForm />
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PartnersPage;
