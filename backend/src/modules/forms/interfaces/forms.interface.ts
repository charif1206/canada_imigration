/**
 * Forms module interfaces
 */

/**
 * Form types
 */
export type FormType = 'EQUIVALENCE' | 'RESIDENCE' | 'PARTNER';

/**
 * Form status
 */
export type FormStatus = 'pending' | 'approved' | 'rejected';

/**
 * Generic form submission response
 */
export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  formId: string;
  status: FormStatus;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  url: string | null;
  uploaded: boolean;
  error?: string;
}

/**
 * Client selection in form response
 */
export interface FormClientInfo {
  id: string;
  name: string;
  email: string;
  passportNumber?: string;
  nationality?: string;
  isEmailVerified?: boolean;
  createdAt?: Date;
}

/**
 * Equivalence form data
 */
export interface EquivalenceFormData {
  type: 'EQUIVALENCE';
  email: string;
  telephone: string;
  prenom: string;
  nom: string;
  adresse: string;
  codePostal: string;
  niveau: string;
  universite: string;
  titreLicence: string;
  titreMaster: string | null;
  anneeDebut: string;
  anneeObtentionLicence: string;
  anneeObtentionMaster: string | null;
  portfolioUrl: string | null;
  submittedAt: Date;
}

/**
 * Residence form data
 */
export interface ResidenceFormData {
  type: 'RESIDENCE';
  nomComplet: string;
  dateNaissance: string;
  paysResidence: string;
  programme: string;
  numeroDossier: string;
  etape: string;
  diplome: string | null;
  anneesEtudes: string | null;
  anneesExperience: string | null;
  situationFamiliale: string | null;
  fileUrl: string | null;
  submittedAt: Date;
}

/**
 * Partner form data
 */
export interface PartnerFormData {
  type: 'PARTNER';
  agencyName: string;
  managerName: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  clientCount: string | null;
  message: string | null;
  submittedAt: Date;
}

/**
 * Database form submission structure
 */
export interface FormSubmission {
  id: string;
  clientId: string | null;
  type: FormType;
  data: EquivalenceFormData | ResidenceFormData | PartnerFormData;
  fileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  client?: FormClientInfo;
}

/**
 * Client update data for form submission
 */
export interface ClientFormUpdateData {
  statusField: string;
  folderField?: string;
  folderUrl?: string | null;
  flagField: string;
}
