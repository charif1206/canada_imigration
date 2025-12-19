'use client';

import React, { useRef, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTimeRemaining } from '@/lib/hooks/useTimeRemaining';
import {
    PageHeader,
    PartnerStatusDisplay,
    ResubmitNotice,
    PartnerBenefitsSection,
    PartnerApplicationForm,
} from '@/components/partners';

const PartnersPage: React.FC = () => {
    const formRef = useRef<HTMLDivElement>(null);
    const { client, refreshAuth, isAuthenticated } = useAuth();
    const timeRemaining = useTimeRemaining(client?.partnerRejectedAt);
    
    // Auto-refresh every 5 minutes to check for status updates
    useEffect(() => {
        if (isAuthenticated && client) {
            const interval = setInterval(() => {
                refreshAuth();
            }, 5 * 60 * 1000); // 5 minutes

            return () => clearInterval(interval);
        }
    }, [client, refreshAuth, isAuthenticated]);

    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Check if user can resubmit partner form
    const canResubmitPartner = client?.partnerStatus !== 'rejected' || 
        (client?.partnerRejectedAt && timeRemaining.canResubmit);
    
    const shouldShowForm = !client?.partnerStatus || 
        client?.partnerStatus === 'form' || 
        canResubmitPartner;

    return (
        <ProtectedRoute>
            <div className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#F4F4F4' }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader 
                        title="🤝 Programme Partenaire pour Agences de Voyages"
                        subtitle="Un partenariat gagnant pour accompagner vos clients vers le Canada."
                    />

                    {!shouldShowForm ? (
                        <PartnerStatusDisplay
                            partnerStatus={client?.partnerStatus}
                            partnerRejectionReason={client?.partnerRejectionReason}
                            partnerRejectedAt={client?.partnerRejectedAt}
                        />
                    ) : (
                        <>
                            {client?.partnerStatus === 'rejected' && canResubmitPartner && (
                                <ResubmitNotice canResubmit={canResubmitPartner} />
                            )}
                            
                            <PartnerBenefitsSection onScrollToForm={handleScrollToForm} />
            
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