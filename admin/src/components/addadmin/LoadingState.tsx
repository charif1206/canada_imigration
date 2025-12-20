/**
 * Loading State Component
 */

import { getLoadingMessage } from '@/lib/utils/permission.utils';

interface LoadingStateProps {
  isAuthenticated: boolean;
}

export default function LoadingState({ isAuthenticated }: LoadingStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{getLoadingMessage(isAuthenticated)}</p>
      </div>
    </div>
  );
}
