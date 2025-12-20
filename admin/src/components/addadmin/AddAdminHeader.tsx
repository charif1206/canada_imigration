/**
 * Add Admin Page Header Component
 */

import Link from 'next/link';
import { ADD_ADMIN_ROUTES, ADD_ADMIN_MESSAGES } from '@/lib/constants/addAdmin.constants';

interface User {
  username: string;
}

interface AddAdminHeaderProps {
  user: User | null;
}

export default function AddAdminHeader({ user }: AddAdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={ADD_ADMIN_ROUTES.DASHBOARD}
              className="text-purple-600 hover:text-purple-700 transition-colors"
              aria-label="Back to dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ADD_ADMIN_MESSAGES.PAGE_TITLE}</h1>
              <p className="text-sm text-gray-600">{ADD_ADMIN_MESSAGES.PAGE_SUBTITLE}</p>
            </div>
          </div>
          {user && (
            <div className="text-sm text-gray-600">
              Logged in as: <span className="font-medium text-gray-900">{user.username}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
