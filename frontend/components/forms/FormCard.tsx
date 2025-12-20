/**
 * Form Card Component
 * Reusable card component for displaying form options
 */

import React from 'react';
import Link from 'next/link';

export interface FormCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  linkText?: string;
}

export const FormCard: React.FC<FormCardProps> = ({
  href,
  icon,
  title,
  description,
  linkText = 'Accéder au formulaire',
}) => {
  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 cursor-pointer border-2 border-transparent hover:border-blue-500">
        <div className="text-center">
          <div className="text-6xl mb-6">{icon}</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">{title}</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
          <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
            {linkText}
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
