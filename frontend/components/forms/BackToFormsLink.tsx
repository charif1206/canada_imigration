/**
 * Back to Forms Link Component
 * Navigation link to return to forms listing
 */

import React from 'react';
import Link from 'next/link';
import { FORM_MESSAGES } from '@/lib/constants/forms.constants';

export const BackToFormsLink: React.FC = () => {
  return (
    <Link
      href="/forms"
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {FORM_MESSAGES.BACK_TO_FORMS}
    </Link>
  );
};
