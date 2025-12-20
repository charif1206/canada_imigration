/**
 * Partner Benefit Item Component
 * Displays a single benefit with icon, title, description and checklist
 */

import React from 'react';

export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
  items: readonly string[];
}

export interface PartnerBenefitItemProps {
  benefit: BenefitItem;
}

export const PartnerBenefitItem: React.FC<PartnerBenefitItemProps> = ({ benefit }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{benefit.icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">
        {benefit.title}
      </h3>
      <p className="text-slate-600 mb-4">{benefit.description}</p>
      <ul className="space-y-2">
        {benefit.items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-slate-700">
            <span className="text-green-600 mt-1">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
