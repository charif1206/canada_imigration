import React from 'react';
import { PasswordFormField } from './PasswordFormField';
import { PasswordMismatchWarning } from './PasswordMismatchWarning';
import { LoadingSpinner } from '../auth/LoadingSpinner';

interface ResetPasswordFormProps {
    password: string;
    confirmPassword: string;
    isSubmitting: boolean;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    password,
    confirmPassword,
    isSubmitting,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit
}) => {
    const passwordsMatch = password === confirmPassword;

    return (
        <form onSubmit={onSubmit} className="space-y-6 text-black">
            <PasswordFormField
                id="password"
                label="New Password"
                value={password}
                onChange={onPasswordChange}
                helperText="Must be at least 6 characters"
            />

            <PasswordFormField
                id="confirmPassword"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
            />

            <PasswordMismatchWarning
                password={password}
                confirmPassword={confirmPassword}
            />

            <button
                type="submit"
                disabled={isSubmitting || !passwordsMatch}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-base"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center">
                        <LoadingSpinner />
                        Resetting...
                    </span>
                ) : (
                    'Reset Password'
                )}
            </button>
        </form>
    );
};
