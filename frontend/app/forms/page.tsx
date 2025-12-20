'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FormCard } from '@/components/forms/FormCard';
import { FormsHelpSection } from '@/components/forms/FormsHelpSection';
import { FORM_METADATA, FORM_MESSAGES } from '@/lib/constants/forms.constants';

/**
 * Forms Landing Page
 * Displays available forms for authenticated users
 */
const FormsPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900 mb-4">
              {FORM_MESSAGES.FORMS_PAGE_TITLE}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              {FORM_MESSAGES.FORMS_PAGE_SUBTITLE}
            </p>
          </div>

          {/* Form Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FormCard
              href="/forms/equivalence"
              icon={FORM_METADATA.equivalence.icon}
              title={FORM_METADATA.equivalence.title}
              description={FORM_METADATA.equivalence.description}
              linkText={FORM_MESSAGES.ACCESS_FORM}
            />

            <FormCard
              href="/forms/residence"
              icon={FORM_METADATA.residence.icon}
              title={FORM_METADATA.residence.title}
              description={FORM_METADATA.residence.description}
              linkText={FORM_MESSAGES.ACCESS_FORM}
            />
          </div>

          {/* Help Section */}
          <FormsHelpSection />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FormsPage;
