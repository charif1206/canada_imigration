import React from 'react';

interface PasswordMismatchWarningProps {
    password: string;
    confirmPassword: string;
}

export const PasswordMismatchWarning: React.FC<PasswordMismatchWarningProps> = ({
    password,
    confirmPassword
}) => {
    if (!password || !confirmPassword || password === confirmPassword) {
        return null;
    }

    return (
        <p className="text-sm text-red-600">
            ⚠️ Passwords do not match
        </p>
    );
};
