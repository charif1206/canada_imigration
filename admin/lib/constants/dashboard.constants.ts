/**
 * Dashboard Constants
 * Centralized configuration for admin dashboard
 */

export type TabType = 'pending-partner' | 'pending-residence' | 'pending-equivalence' | 'last-verified' | 'all-clients';

export type FormType = 'equivalence' | 'residence' | 'partner';

/**
 * Tab Configuration
 */
export const TAB_CONFIG = {
  PENDING_PARTNER: {
    id: 'pending-partner' as TabType,
    label: '🤝 Pending Partner',
    icon: '🤝',
    color: 'green',
    headerColor: 'bg-green-600',
  },
  PENDING_RESIDENCE: {
    id: 'pending-residence' as TabType,
    label: '🏠 Pending Residence',
    icon: '🏠',
    color: 'indigo',
    headerColor: 'bg-indigo-600',
  },
  PENDING_EQUIVALENCE: {
    id: 'pending-equivalence' as TabType,
    label: '🎓 Pending Equivalence',
    icon: '🎓',
    color: 'purple',
    headerColor: 'bg-purple-600',
  },
  LAST_VERIFIED: {
    id: 'last-verified' as TabType,
    label: '✅ Last Verified',
    icon: '✅',
    color: 'green',
    headerColor: 'bg-green-600',
  },
  ALL_CLIENTS: {
    id: 'all-clients' as TabType,
    label: '📋 All Clients',
    icon: '📋',
    color: 'slate',
    headerColor: 'bg-slate-600',
  },
} as const;

/**
 * Stats Card Configuration
 */
export const STATS_CONFIG = {
  PENDING_PARTNER: {
    label: '🤝 Partner',
    color: 'text-green-600',
  },
  PENDING_RESIDENCE: {
    label: '🏠 Residence',
    color: 'text-indigo-600',
  },
  PENDING_EQUIVALENCE: {
    label: '🎓 Equivalence',
    color: 'text-purple-600',
  },
  VALIDATED: {
    label: '✅ Validated',
    color: 'text-green-600',
  },
  ALL_CLIENTS: {
    label: '📋 All Clients',
    color: 'text-slate-600',
  },
} as const;

/**
 * Table Headers Configuration
 */
export const TABLE_HEADERS = {
  PENDING: ['Name', 'Email', 'Passport', 'Nationality', 'Submitted Date', 'Actions'],
  VERIFIED: ['Name', 'Email', 'Passport', 'Nationality', 'Verified Type', 'Verified At', 'Actions'],
  ALL_CLIENTS: ['Name', 'Email', 'Passport', 'Nationality', 'Registered Date', 'Actions'],
} as const;

/**
 * Verification Types Configuration
 */
export const VERIFICATION_TYPES = {
  EQUIVALENCE: {
    type: 'Equivalence',
    icon: '🎓',
    statusField: 'equivalenceStatus',
  },
  RESIDENCE: {
    type: 'Residence',
    icon: '🏠',
    statusField: 'residenceStatus',
  },
  PARTNER: {
    type: 'Partner',
    icon: '🤝',
    statusField: 'partnerStatus',
  },
} as const;

/**
 * UI Messages
 */
export const UI_MESSAGES = {
  LOADING: {
    PARTNER: 'Loading partner applications...',
    RESIDENCE: 'Loading residence applications...',
    EQUIVALENCE: 'Loading equivalence applications...',
    VERIFIED: 'Loading verified clients...',
    ALL_CLIENTS: 'Loading clients...',
    DEFAULT: 'Loading...',
  },
  EMPTY: {
    PARTNER: 'No pending partner applications',
    RESIDENCE: 'No pending residence applications',
    EQUIVALENCE: 'No pending equivalence applications',
    VERIFIED: 'No verified clients yet',
    ALL_CLIENTS: 'No clients found',
    DEFAULT: 'Select a tab to view data',
  },
} as const;

/**
 * Action Button Configuration
 */
export const ACTION_BUTTONS = {
  VIEW_DATA: {
    label: '👁️ View Data',
    className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium',
  },
  VALIDATE: {
    label: '✓ Validate',
    className: 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium',
  },
} as const;

/**
 * Pagination Configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 10,
  MAX_PAGE_BUTTONS: 5,
} as const;

/**
 * Routes Configuration
 */
export const ROUTES = {
  LOGIN: '/login',
  BLOGS: '/blogs',
  ADD_ADMIN: '/addadmin',
  DETAILS: {
    CLIENT: (id: string) => `/details?type=client&id=${id}`,
    FORM: (id: string) => `/details?type=form&id=${id}`,
    PARTNER: (id: string) => `/details?type=partner&id=${id}`,
  },
} as const;

/**
 * Dashboard Configuration
 */
export const DASHBOARD_CONFIG = {
  TITLE: '🍁 Canada Immigration Admin Dashboard',
  SUBTITLE: 'Manage client applications and validations',
  HEADER_GRADIENT: 'bg-linear-to-r from-purple-600 to-purple-800',
} as const;
