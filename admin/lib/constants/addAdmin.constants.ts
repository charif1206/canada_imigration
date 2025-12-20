/**
 * Add Admin Constants
 * Configuration for add admin page
 */

export const ADD_ADMIN_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
} as const;

export const ADD_ADMIN_MESSAGES = {
  PAGE_TITLE: 'Add New Admin',
  PAGE_SUBTITLE: 'Create a new administrator account',
  SUCCESS_TITLE: 'Admin created successfully!',
  SUCCESS_MESSAGE: '📧 A verification email has been sent. The admin must verify their email before logging in.',
  SECURITY_NOTICE_TITLE: 'Security Notice',
  SECURITY_NOTICE_MESSAGE: 'The new admin will receive their credentials and should change their password immediately upon first login.',
  LOADING: {
    AUTH: 'Verifying authentication...',
    PERMISSION: 'Checking permissions...',
  },
  BUTTON: {
    CREATING: 'Creating Account...',
    CREATED: 'Account Created!',
    CREATE: 'Create Admin Account',
    CANCEL: 'Cancel',
  },
} as const;

export const FORM_FIELDS = {
  USERNAME: {
    id: 'username',
    label: 'Username',
    placeholder: 'Enter username',
    helpText: 'Minimum 3 characters, letters and numbers only',
    autoComplete: 'username',
  },
  EMAIL: {
    id: 'email',
    label: 'Email Address',
    placeholder: 'admin@example.com',
    helpText: 'Valid email address for account notifications',
    autoComplete: 'email',
  },
  PASSWORD: {
    id: 'password',
    label: 'Password',
    placeholder: 'Enter secure password',
    helpText: 'Minimum 8 characters, include letters and numbers',
    autoComplete: 'new-password',
  },
  CONFIRM_PASSWORD: {
    id: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Re-enter password',
    autoComplete: 'new-password',
  },
  ROLE: {
    id: 'role',
    label: 'Role',
    helpText: 'Admin: Handles dashboard data only | Moderator: Full access including adding admins',
  },
} as const;

export const ROLE_OPTIONS = [
  {
    value: 'admin' as const,
    label: 'Admin - Can view and manage dashboard data',
  },
  {
    value: 'moderator' as const,
    label: 'Moderator - Can manage data and add new admins',
  },
] as const;

export const FORM_DEFAULTS = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'admin' as const,
} as const;

export const PERMISSION_CHECK_DELAY = 100;
