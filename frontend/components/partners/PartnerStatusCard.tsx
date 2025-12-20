/**
 * Partner Status Card Component
 * Displays current partner application status with appropriate styling
 */

import React from 'react';
import {
  PARTNER_STATUS,
  PARTNER_STATUS_MESSAGES,
  PartnerStatusType,
} from '@/lib/constants/partners.constants';
import { calculatePartnerTimeRemaining } from '@/lib/utils/partnerTime.utils';

export interface PartnerStatusCardProps {
  status: string | null | undefined;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
}

export const PartnerStatusCard: React.FC<PartnerStatusCardProps> = ({
  status,
  rejectedAt,
  rejectionReason,
}) => {
  if (!status || status === 'form') return null;

  const getStatusConfig = () => {
    switch (status) {
      case PARTNER_STATUS.PENDING:
        return {
          ...PARTNER_STATUS_MESSAGES.PENDING,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
        };
      case PARTNER_STATUS.VALIDATED:
        return {
          ...PARTNER_STATUS_MESSAGES.VALIDATED,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        };
      case PARTNER_STATUS.REJECTED:
        const timeRemaining = calculatePartnerTimeRemaining(rejectedAt);
        return {
          ...PARTNER_STATUS_MESSAGES.REJECTED,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          timeRemaining,
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div
        className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-6 sm:p-8`}
      >
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${config.textColor}`}>
          {config.title}
        </h2>
        <p className="text-slate-700 mb-4 text-base sm:text-lg">
          {config.message}
        </p>

        {status === PARTNER_STATUS.REJECTED && rejectionReason && (
          <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
            <p className="font-semibold text-red-800 mb-2">Raison du refus :</p>
            <p className="text-slate-700">{rejectionReason}</p>
          </div>
        )}

        {status === PARTNER_STATUS.REJECTED && 'timeRemaining' in config && (
          <div className="bg-white border border-red-200 rounded-lg p-4">
            {config.timeRemaining.canResubmit ? (
              <p className="text-green-700 font-semibold">
                {PARTNER_STATUS_MESSAGES.REJECTED.resubmitMessage}
              </p>
            ) : (
              <p className="text-amber-700">
                {PARTNER_STATUS_MESSAGES.REJECTED.waitingMessage}{' '}
                <strong>
                  {config.timeRemaining.hoursLeft}h {config.timeRemaining.minutesLeft}min
                </strong>
              </p>
            )}
          </div>
        )}

        {config.note && (
          <p className="text-sm text-slate-600 mt-4 italic">{config.note}</p>
        )}
      </div>
    </div>
  );
};
