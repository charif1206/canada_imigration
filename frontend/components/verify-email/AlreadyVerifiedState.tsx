import React from 'react';
import { StatusPageContainer, IconCircle, StatusHeading, ActionButton } from '../status';

const InfoIcon = () => (
    <svg className="w-full h-full text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const AlreadyVerifiedState: React.FC = () => (
    <StatusPageContainer gradientFrom="yellow-600" gradientTo="orange-600">
        <IconCircle variant="yellow" size="sm">
            <InfoIcon />
        </IconCircle>
        
        <StatusHeading
            title="Already Verified"
            subtitle="This email address has already been verified. You can log in to your account."
        />

        <ActionButton href="/login" variant="yellow">
            Go to Login
        </ActionButton>
    </StatusPageContainer>
);
