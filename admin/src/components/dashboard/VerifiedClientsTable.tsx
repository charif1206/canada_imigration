/**
 * Verified Clients Table Component
 * Displays clients with validated applications
 */

import { VerificationEntry } from '@/lib/utils/verification.utils';
import { formatDate } from '@/lib/utils/date.utils';
import { ACTION_BUTTONS } from '@/lib/constants/dashboard.constants';

interface VerifiedClientsTableProps {
  entries: VerificationEntry[];
  onViewDetails: (clientId: string) => void;
}

export default function VerifiedClientsTable({
  entries,
  onViewDetails,
}: VerifiedClientsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Passport</th>
            <th className="px-4 py-3 text-left">Nationality</th>
            <th className="px-4 py-3 text-left">Verified Type</th>
            <th className="px-4 py-3 text-left">Verified At</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 font-medium">{entry.clientName}</td>
              <td className="px-4 py-4">{entry.clientEmail}</td>
              <td className="px-4 py-4">{entry.passportNumber || 'N/A'}</td>
              <td className="px-4 py-4">{entry.nationality || 'N/A'}</td>
              <td className="px-4 py-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {entry.verificationIcon} {entry.verificationType}
                </span>
              </td>
              <td className="px-4 py-4">{formatDate(entry.verifiedAt)}</td>
              <td className="px-4 py-4">
                <button
                  className={ACTION_BUTTONS.VIEW_DATA.className}
                  onClick={() => onViewDetails(entry.clientId)}
                >
                  {ACTION_BUTTONS.VIEW_DATA.label}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
