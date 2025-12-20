/**
 * Forms Module Constants
 * Centralized configuration and messages for forms functionality
 */

/**
 * Form types
 */
export const FORM_TYPES = {
  EQUIVALENCE: 'equivalence',
  RESIDENCE: 'residence',
  PARTNER: 'partner',
} as const;

/**
 * Form status types
 */
export const FORM_STATUS = {
  PENDING: 'pending',
  VALIDATED: 'validated',
  REJECTED: 'rejected',
} as const;

/**
 * Resubmission timing
 */
export const RESUBMISSION_CONFIG = {
  WAITING_PERIOD_MS: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  TEMP_SENDING_PREFIX: 'temp_sending_',
} as const;

/**
 * Form metadata
 */
export const FORM_METADATA = {
  equivalence: {
    title: 'Équivalence de diplôme',
    icon: '🎓',
    description: 'Fournissez les informations nécessaires pour la demande d\'équivalence de votre diplôme',
    statusKey: 'equivalenceStatus',
    sendingKey: 'isSendingFormulaireEquivalence',
    rejectedAtKey: 'equivalenceRejectedAt',
    rejectionReasonKey: 'equivalenceRejectionReason',
  },
  residence: {
    title: 'Résidence Permanente',
    icon: '🧩',
    description: 'Mettez à jour votre dossier de résidence permanente (CSQ et Fédéral)',
    statusKey: 'residenceStatus',
    sendingKey: 'isSendingFormulaireResidence',
    rejectedAtKey: 'residenceRejectedAt',
    rejectionReasonKey: 'residenceRejectionReason',
  },
  partner: {
    title: 'Partenariat',
    icon: '🤝',
    description: 'Formulaire de demande de partenariat',
    statusKey: 'partnerStatus',
    sendingKey: 'isSendingPartners',
    rejectedAtKey: 'partnerRejectedAt',
    rejectionReasonKey: 'partnerRejectionReason',
  },
} as const;

/**
 * UI Messages
 */
export const FORM_MESSAGES = {
  BACK_TO_FORMS: 'Retour aux formulaires',
  NEED_HELP: 'Besoin d\'aide ?',
  HELP_DESCRIPTION: 'Si vous avez des questions concernant les formulaires, n\'hésitez pas à nous contacter',
  CONTACT_US: 'Nous contacter',
  FORMS_PAGE_TITLE: '📝 Formulaires de services',
  FORMS_PAGE_SUBTITLE: 'Choisissez le formulaire correspondant à votre besoin',
  ACCESS_FORM: 'Accéder au formulaire',
} as const;

export type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES];
export type FormStatusType = typeof FORM_STATUS[keyof typeof FORM_STATUS];
