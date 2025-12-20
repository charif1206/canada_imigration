/**
 * Client Filtering Utilities
 */

import { Client } from '@/src/types/client.types';

/**
 * Filter clients by partner status
 */
export function filterPendingPartnerClients(clients: Client[] | undefined): Client[] {
  if (!clients) return [];
  return clients.filter(
    (client) => client.isSendingPartners && client.partnerStatus === 'pending'
  );
}

/**
 * Filter clients by residence status
 */
export function filterPendingResidenceClients(clients: Client[] | undefined): Client[] {
  if (!clients) return [];
  return clients.filter(
    (client) => client.isSendingFormulaireResidence && client.residenceStatus === 'pending'
  );
}

/**
 * Filter clients by equivalence status
 */
export function filterPendingEquivalenceClients(clients: Client[] | undefined): Client[] {
  if (!clients) return [];
  return clients.filter(
    (client) => client.isSendingFormulaireEquivalence && client.equivalenceStatus === 'pending'
  );
}
