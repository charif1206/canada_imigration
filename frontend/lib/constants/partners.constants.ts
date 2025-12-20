/**
 * Partners Module Constants
 * Centralized configuration and messages for partners functionality
 */

/**
 * Partner status types
 */
export const PARTNER_STATUS = {
  FORM: 'form',
  PENDING: 'pending',
  VALIDATED: 'validated',
  REJECTED: 'rejected',
} as const;

/**
 * Resubmission configuration
 */
export const PARTNER_RESUBMISSION_CONFIG = {
  WAITING_PERIOD_MS: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Partner page content
 */
export const PARTNER_CONTENT = {
  PAGE_TITLE: '🤝 Programme Partenaire pour Agences de Voyages',
  PAGE_SUBTITLE: 'Un partenariat gagnant pour accompagner vos clients vers le Canada.',
  BENEFITS_TITLE: 'Pourquoi devenir partenaire ?',
  BENEFITS_SUBTITLE: 'Profitez de nombreux avantages en rejoignant notre réseau de partenaires',
  FORM_TITLE: 'Formulaire de Candidature',
} as const;

/**
 * Partner benefits list
 */
export const PARTNER_BENEFITS = [
  {
    icon: '💰',
    title: 'Commissions attractives',
    description: 'Bénéficiez de commissions compétitives sur chaque client référé',
    items: [
      'Taux de commission avantageux',
      'Paiements mensuels garantis',
      'Bonus pour les performances exceptionnelles',
    ],
  },
  {
    icon: '🎓',
    title: 'Formation & Support',
    description: 'Accédez à notre programme de formation complet',
    items: [
      'Formation initiale gratuite',
      'Support technique 24/7',
      'Mise à jour régulière des procédures',
      'Webinaires mensuels',
    ],
  },
  {
    icon: '📊',
    title: 'Outils marketing',
    description: 'Recevez du matériel promotionnel professionnel',
    items: [
      'Brochures personnalisées',
      'Accès à notre plateforme de gestion',
      'Matériel marketing digital',
    ],
  },
  {
    icon: '🌟',
    title: 'Réseau exclusif',
    description: 'Rejoignez une communauté de professionnels',
    items: [
      'Accès au réseau de partenaires',
      'Événements exclusifs',
      'Partage d\'expériences et bonnes pratiques',
    ],
  },
] as const;

/**
 * Status messages
 */
export const PARTNER_STATUS_MESSAGES = {
  PENDING: {
    title: '⏳ Candidature en cours de traitement',
    message: 'Votre demande de partenariat est en cours d\'examen. Notre équipe l\'analysera dans les plus brefs délais.',
    note: 'Vous recevrez une notification par email dès que votre candidature sera traitée.',
  },
  VALIDATED: {
    title: '✅ Félicitations ! Votre candidature est acceptée',
    message: 'Bienvenue dans notre réseau de partenaires ! Nous sommes ravis de vous compter parmi nous.',
    note: 'Notre équipe vous contactera prochainement pour finaliser votre inscription et vous fournir tous les outils nécessaires.',
  },
  REJECTED: {
    title: '❌ Candidature non retenue',
    message: 'Malheureusement, votre candidature n\'a pas été retenue pour le moment.',
    resubmitMessage: '✅ Vous pouvez soumettre une nouvelle candidature maintenant.',
    waitingMessage: '⏳ Vous pourrez soumettre une nouvelle candidature dans',
  },
} as const;

/**
 * Form field labels and placeholders
 */
export const PARTNER_FORM_FIELDS = {
  AGENCY_NAME: {
    label: 'Nom de l\'agence',
    placeholder: 'Entrez le nom de votre agence',
    required: true,
  },
  MANAGER_NAME: {
    label: 'Nom du responsable',
    placeholder: 'Entrez votre nom complet',
    required: true,
  },
  EMAIL: {
    label: 'Email professionnel',
    placeholder: 'votre.email@agence.com',
    required: true,
  },
  PHONE: {
    label: 'Téléphone',
    placeholder: '+1 234 567 8900',
    required: true,
  },
  ADDRESS: {
    label: 'Adresse (optionnel)',
    placeholder: 'Adresse de votre agence',
    required: false,
  },
  CITY: {
    label: 'Ville (optionnel)',
    placeholder: 'Ville',
    required: false,
  },
  CLIENT_COUNT: {
    label: 'Nombre de clients par an (optionnel)',
    placeholder: 'Ex: 50',
    required: false,
  },
  MESSAGE: {
    label: 'Message / Motivation (optionnel)',
    placeholder: 'Parlez-nous de votre agence et de vos motivations...',
    required: false,
  },
} as const;

/**
 * Form validation messages
 */
export const PARTNER_FORM_MESSAGES = {
  SUBMIT_BUTTON: 'Soumettre ma candidature',
  SUBMITTING: 'Envoi en cours...',
  SUCCESS: 'Candidature envoyée avec succès !',
  ERROR: 'Une erreur est survenue. Veuillez réessayer.',
} as const;

export type PartnerStatusType = typeof PARTNER_STATUS[keyof typeof PARTNER_STATUS];
