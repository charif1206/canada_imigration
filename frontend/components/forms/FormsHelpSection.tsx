/**
 * Forms Help Section Component
 * Displays help/contact information for form users
 */

import React from 'react';
import Link from 'next/link';
import { FORM_MESSAGES } from '@/lib/constants/forms.constants';

export const FormsHelpSection: React.FC = () => {
  return (
    <div className="mt-16 text-center">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          💡 {FORM_MESSAGES.NEED_HELP}
        </h3>
        <p className="text-slate-600 mb-4">
          {FORM_MESSAGES.HELP_DESCRIPTION}
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {FORM_MESSAGES.CONTACT_US}
        </Link>
      </div>
    </div>
  );
};
