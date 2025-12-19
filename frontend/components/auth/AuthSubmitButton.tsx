import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface AuthSubmitButtonProps {
    isLoading: boolean;
    loadingText: string;
    buttonText: string;
}

export const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
    isLoading,
    loadingText,
    buttonText
}) => {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed min-h-[44px] text-base"
        >
            {isLoading ? (
                <span className="flex items-center justify-center">
                    <LoadingSpinner />
                    {loadingText}
                </span>
            ) : (
                buttonText
            )}
        </button>
    );
};
