/**
 * Security Notice Component
 */

import { ADD_ADMIN_MESSAGES } from '@/lib/constants/addAdmin.constants';

export default function SecurityNotice() {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">{ADD_ADMIN_MESSAGES.SECURITY_NOTICE_TITLE}</p>
          <p className="text-sm text-blue-700 mt-1">{ADD_ADMIN_MESSAGES.SECURITY_NOTICE_MESSAGE}</p>
        </div>
      </div>
    </div>
  );
}
