/**
 * Forms module configuration constants
 */

// Form types
export const FORM_TYPES = {
  EQUIVALENCE: 'EQUIVALENCE' as const,
  RESIDENCE: 'RESIDENCE' as const,
  PARTNER: 'PARTNER' as const,
};

// Form status
export const FORM_STATUS = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
};

// Cloudinary folders
export const CLOUDINARY_FOLDERS = {
  EQUIVALENCE: 'forms/equivalence',
  RESIDENCE: 'forms/residence',
};

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  UPLOAD_DIRECTORY: './uploads/forms',
};

// Success messages
export const SUCCESS_MESSAGES = {
  EQUIVALENCE_SUBMITTED: 'Equivalence form submitted successfully. We will review your application and contact you soon.',
  RESIDENCE_SUBMITTED: 'Residence form submitted successfully. We will process your application and contact you soon.',
  PARTNER_SUBMITTED: 'Partner application submitted successfully. We will contact you within 24 hours.',
};

// Log messages
export const LOG_MESSAGES = {
  FORM_SUBMITTED: '📝 {type} form submitted for: {identifier}',
  FILE_UPLOADED: '📁 File uploaded to Cloudinary: {url}',
  FILE_UPLOAD_FAILED: '❌ Failed to upload file to Cloudinary: {error}',
  FORM_PERSISTED: '✅ {type} form persisted (id={id}, clientId={clientId})',
  CLIENT_UPDATED: '✅ Updated client {clientId} {type} form status to {status}',
  CLIENT_FOLDER_SAVED: '📂 Saved folder URL for client {clientId}',
  DATABASE_SAVE_FAILED: '⚠️ Could not save {type} form to database, continuing',
  FETCH_FORMS_FAILED: '❌ Failed to fetch forms',
  FETCH_FORM_FAILED: '❌ Failed to fetch form {id}',
};

// Client update fields mapping
export const CLIENT_UPDATE_FIELDS = {
  EQUIVALENCE: {
    FLAG: 'isSendingFormulaireEquivalence',
    STATUS: 'equivalenceStatus',
    REJECTED_AT: 'equivalenceRejectedAt',
    REJECTION_REASON: 'equivalenceRejectionReason',
    FOLDER: 'folderEquivalence',
  },
  RESIDENCE: {
    FLAG: 'isSendingFormulaireResidence',
    STATUS: 'residenceStatus',
    REJECTED_AT: 'residenceRejectedAt',
    REJECTION_REASON: 'residenceRejectionReason',
    FOLDER: 'folderResidence',
  },
  PARTNER: {
    FLAG: 'isSendingPartners',
    STATUS: 'partnerStatus',
    REJECTED_AT: 'partnerRejectedAt',
    REJECTION_REASON: 'partnerRejectionReason',
  },
};
