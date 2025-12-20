/**
 * Partner Benefits Grid Component
 * Displays grid of partner benefits with scroll-to-form button
 */

import React from 'react';
import { PartnerBenefitItem } from './PartnerBenefitItem';
import { PARTNER_BENEFITS, PARTNER_CONTENT } from '@/lib/constants/partners.constants';

export interface PartnerBenefitsGridProps {
  onScrollToForm: () => void;
}

export const PartnerBenefitsGrid: React.FC<PartnerBenefitsGridProps> = ({
  onScrollToForm,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8 sm:mb-12">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
          {PARTNER_CONTENT.BENEFITS_TITLE}
        </h2>
        <p className="text-slate-600 max-w-3xl mx-auto">
          {PARTNER_CONTENT.BENEFITS_SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {PARTNER_BENEFITS.map((benefit, index) => (
          <PartnerBenefitItem key={index} benefit={benefit} />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onScrollToForm}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 min-h-11"
        >
          Postuler maintenant
        </button>
      </div>
    </div>
  );
};
