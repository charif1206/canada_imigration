/**
 * Authentication Module Constants
 * Centralized configuration and messages for authentication functionality
 */

/**
 * Authentication routes
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  STATUS: '/status',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

/**
 * Page content configuration
 */
export const AUTH_PAGE_CONTENT = {
  LOGIN: {
    icon: '🍁',
    title: 'Client Login',
    subtitle: 'Access your immigration application status',
    footerText: "Don't have an account?",
    footerLinkText: 'Register here',
    footerLinkHref: '/register',
  },
  REGISTER: {
    icon: '🍁',
    title: 'Register for Immigration Services',
    subtitle: 'Start your journey to Canada',
    footerText: 'Already registered?',
    footerLinkText: 'Login here',
    footerLinkHref: '/login',
  },
} as const;

/**
 * Login help links
 */
export const LOGIN_HELP_LINKS = {
  VERIFY_EMAIL: {
    text: 'Need to verify your email?',
    linkText: 'Verify now',
    href: '/verify-email',
  },
  FORGOT_PASSWORD: {
    text: 'Forgot your password?',
    linkText: 'Reset password',
    href: '/forgot-password',
  },
} as const;

/**
 * Success messages
 */
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN: (name: string) => `🎉 Welcome back, ${name}!`,
  REGISTER: (name: string) => `🎉 Welcome, ${name}! Please check your email to verify your account.`,
  LOGOUT: 'You have been logged out successfully.',
} as const;

/**
 * Error messages
 */
export const AUTH_ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  LOGOUT_FAILED: 'Logout failed. Please try again.',
  ALREADY_AUTHENTICATED: 'You are already logged in.',
} as const;

/**
 * Form button labels
 */
export const AUTH_BUTTON_LABELS = {
  LOGIN: 'Sign In',
  LOGIN_PENDING: 'Signing in...',
  REGISTER: 'Create Account',
  REGISTER_PENDING: 'Creating account...',
  LOGOUT: 'Logout',
} as const;

/**
 * Form field configuration
 */
export const AUTH_FORM_FIELDS = {
  NAME: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    type: 'text',
    required: true,
  },
  EMAIL: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    required: true,
  },
  PASSWORD: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    required: true,
  },
} as const;

/**
 * Redirect configuration
 */
export const AUTH_REDIRECT_CONFIG = {
  LOGIN_SUCCESS: '/status',
  REGISTER_SUCCESS: '/status',
  ALREADY_AUTHENTICATED: '/profile',
} as const;
