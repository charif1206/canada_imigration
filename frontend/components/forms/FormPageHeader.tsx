/**
 * Form Page Header Component
 * Displays page title and description for form pages
 */

import React from 'react';

export interface FormPageHeaderProps {
  icon: string;
  title: string;
  description: string;
}

export const FormPageHeader: React.FC<FormPageHeaderProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900">
        {icon} {title}
      </h1>
      <p className="text-base sm:text-lg text-slate-600 mt-2">
        {description}
      </p>
    </div>
  );
};
