/**
 * Success Alert Component
 */

import { ADD_ADMIN_MESSAGES } from '@/lib/constants/addAdmin.constants';

export default function SuccessAlert() {
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3" role="alert">
      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <div className="flex-1">
        <p className="font-medium text-green-900">{ADD_ADMIN_MESSAGES.SUCCESS_TITLE}</p>
        <p className="text-sm text-green-700 mt-1">{ADD_ADMIN_MESSAGES.SUCCESS_MESSAGE}</p>
      </div>
    </div>
  );
}
