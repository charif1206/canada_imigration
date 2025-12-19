import React from 'react';
import { EmailFormField } from './EmailFormField';
import { LoadingSpinner } from '../auth/LoadingSpinner';

interface ForgotPasswordFormProps {
    email: string;
    isSubmitting: boolean;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    email,
    isSubmitting,
    onEmailChange,
    onSubmit
}) => (
    <form onSubmit={onSubmit} className="space-y-6 text-black">
        <EmailFormField email={email} onChange={onEmailChange} />

        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-base"
        >
            {isSubmitting ? (
                <span className="flex items-center justify-center">
                    <LoadingSpinner />
                    Sending...
                </span>
            ) : (
                'Send Reset Link'
            )}
        </button>
    </form>
);
