import React from 'react';
import { PendingStatusAlert } from './PendingStatusAlert';
import { ValidatedStatusAlert } from './ValidatedStatusAlert';
import { RejectedStatusAlert } from './RejectedStatusAlert';
import { useTimeRemaining } from '@/lib/hooks/useTimeRemaining';

interface PartnerStatusDisplayProps {
    partnerStatus?: string;
    partnerRejectionReason?: string;
    partnerRejectedAt?: string;
}

export const PartnerStatusDisplay: React.FC<PartnerStatusDisplayProps> = ({
    partnerStatus,
    partnerRejectionReason,
    partnerRejectedAt
}) => {
    const timeRemaining = useTimeRemaining(partnerRejectedAt);

    if (!partnerStatus || partnerStatus === 'form') {
        return null;
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            {partnerStatus === 'pending' && <PendingStatusAlert />}
            {partnerStatus === 'validated' && <ValidatedStatusAlert />}
            {partnerStatus === 'rejected' && (
                <RejectedStatusAlert 
                    rejectionReason={partnerRejectionReason}
                    timeRemaining={timeRemaining}
                />
            )}
        </div>
    );
};
