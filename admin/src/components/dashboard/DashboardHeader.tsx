/**
 * Dashboard Header Component
 * Top navigation with user info and action buttons
 */

import Link from 'next/link';
import { DASHBOARD_CONFIG, ROUTES } from '@/lib/constants/dashboard.constants';

interface User {
  username: string;
  role: string;
}

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className={`${DASHBOARD_CONFIG.HEADER_GRADIENT} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-6 py-8 ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">{DASHBOARD_CONFIG.TITLE}</h1>
            <p className="text-purple-100">{DASHBOARD_CONFIG.SUBTITLE}</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm text-purple-100">Welcome back,</p>
                <p className="font-semibold">{user.username}</p>
                <p className="text-xs text-purple-200 capitalize">{user.role}</p>
              </div>
            )}
            <Link
              href={ROUTES.BLOGS}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              📝 Manage Blog Posts
            </Link>
            {user?.role === 'moderator' && (
              <Link
                href={ROUTES.ADD_ADMIN}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                + Add Admin
              </Link>
            )}
            <button
              onClick={onLogout}
              className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
