/**
 * Client Type Definitions
 * Matches backend Client model
 */

export interface Client {
  id: string;
  name: string;
  email: string;
  passportNumber: string | null;
  nationality: string | null;
  isValidated: boolean;
  validatedAt: Date | null;
  validatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Form tracking fields for equivalence form
  isSendingFormulaireEquivalence?: boolean;
  equivalenceStatus?: string | null;
  equivalenceRejectedAt?: Date | null;
  equivalenceRejectionReason?: string | null;
  
  // Form tracking fields for residence form
  isSendingFormulaireResidence?: boolean;
  residenceStatus?: string | null;
  residenceRejectedAt?: Date | null;
  residenceRejectionReason?: string | null;
  
  // Form tracking fields for partner form
  isSendingPartners?: boolean;
  partnerStatus?: string | null;
  partnerRejectedAt?: Date | null;
  partnerRejectionReason?: string | null;
}

export interface ClientsResponse {
  clients: Client[];
  total: number;
}

export interface ValidateClientRequest {
  notes?: string;
}

export interface ValidateClientResponse {
  message: string;
  client: Client;
}
