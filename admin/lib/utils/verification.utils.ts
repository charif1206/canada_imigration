/**
 * Verification Entry Utilities
 */

import { Client } from '@/src/types/client.types';

export interface VerificationEntry {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  verificationType: string;
  verificationIcon: string;
  verifiedAt: Date;
  passportNumber?: string;
  nationality?: string;
}

/**
 * Create verification entries from validated clients
 */
export function createVerificationEntries(
  validatedClients: Client[] | undefined
): VerificationEntry[] {
  if (!validatedClients) return [];

  const entries: VerificationEntry[] = [];

  validatedClients.forEach((client) => {
    if (client.equivalenceStatus === 'validated') {
      entries.push({
        id: `${client.id}-equivalence`,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        verificationType: 'Equivalence',
        verificationIcon: '🎓',
        verifiedAt: client.updatedAt,
        passportNumber: client.passportNumber || undefined,
        nationality: client.nationality || undefined,
      });
    }

    if (client.residenceStatus === 'validated') {
      entries.push({
        id: `${client.id}-residence`,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        verificationType: 'Residence',
        verificationIcon: '🏠',
        verifiedAt: client.updatedAt,
        passportNumber: client.passportNumber || undefined,
        nationality: client.nationality || undefined,
      });
    }

    if (client.partnerStatus === 'validated') {
      entries.push({
        id: `${client.id}-partner`,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        verificationType: 'Partner',
        verificationIcon: '🤝',
        verifiedAt: client.updatedAt,
        passportNumber: client.passportNumber || undefined,
        nationality: client.nationality || undefined,
      });
    }
  });

  // Sort by most recent verification first
  return entries.sort(
    (a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime()
  );
}
