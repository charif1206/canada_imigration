/**
 * All Clients Table Component
 * Displays all registered clients with pagination
 */

import { Client } from '@/src/types/client.types';
import { formatDate } from '@/lib/utils/date.utils';
import { ACTION_BUTTONS } from '@/lib/constants/dashboard.constants';

interface AllClientsTableProps {
  clients: Client[];
  onViewDetails: (type: 'client' | 'form' | 'partner', id: string) => void;
}

export default function AllClientsTable({ clients, onViewDetails }: AllClientsTableProps) {
  return (
    <div className="overflow-x-auto text-black">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-600 text-white">
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Passport</th>
            <th className="px-4 py-3 text-left">Nationality</th>
            <th className="px-4 py-3 text-left">Registered Date</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 font-medium">{client.name}</td>
              <td className="px-4 py-4">{client.email}</td>
              <td className="px-4 py-4">{client.passportNumber || 'N/A'}</td>
              <td className="px-4 py-4">{client.nationality || 'N/A'}</td>
              <td className="px-4 py-4">{formatDate(client.createdAt)}</td>
              <td className="px-4 py-4">
                <button
                  className={ACTION_BUTTONS.VIEW_DATA.className}
                  onClick={() => onViewDetails('client', client.id)}
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
