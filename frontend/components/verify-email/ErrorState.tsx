import React from 'react';
import { StatusPageContainer, IconCircle, StatusHeading, InfoBox, ActionButton } from '../status';

interface ErrorStateProps {
    message: string;
}

const ErrorIcon = () => (
    <svg className="w-full h-full text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => (
    <StatusPageContainer gradientFrom="red-600" gradientTo="pink-600">
        <IconCircle variant="red" size="sm">
            <ErrorIcon />
        </IconCircle>
        
        <StatusHeading
            title="Verification Failed"
            subtitle={message}
        />

        <InfoBox
            variant="red"
            title="What can you do?"
            items={[
                'Request a new verification link',
                'Check if the link has expired',
                'Contact support if the problem persists'
            ]}
        />

        <div className="space-y-3">
            <ActionButton href="/forgot-password" variant="red">
                Request New Link
            </ActionButton>
            
            <ActionButton href="/login" variant="gray">
                Back to Login
            </ActionButton>
        </div>
    </StatusPageContainer>
);
