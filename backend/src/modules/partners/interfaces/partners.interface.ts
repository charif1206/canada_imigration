/**
 * Partners module interfaces
 */

/**
 * Partner submission response
 */
export interface PartnerSubmissionResponse {
  success: boolean;
  message: string;
  applicationId: string;
}

/**
 * Partner application data
 */
export interface PartnerApplicationData {
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
 * Partner submission from database
 */
export interface PartnerSubmission {
  id: string;
  type: string;
  data: PartnerApplicationData;
  createdAt: Date;
  updatedAt: Date;
}
