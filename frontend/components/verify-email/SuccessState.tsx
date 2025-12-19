import React from 'react';
import { StatusPageContainer, IconCircle, StatusHeading, InfoBox, ActionButton } from '../status';

const CheckIcon = () => (
    <svg className="w-full h-full text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SuccessState: React.FC = () => (
    <StatusPageContainer gradientFrom="green-600" gradientTo="teal-600">
        <IconCircle variant="green" size="md">
            <CheckIcon />
        </IconCircle>
        
        <StatusHeading
            emoji="🎉"
            title="Email Verified!"
            subtitle="Your email has been successfully verified. You can now access all features of Canada Immigration Services."
        />

        <InfoBox
            variant="green"
            title="What's next?"
            items={[
                'Log in to your account',
                'Complete your profile',
                'Submit your immigration application',
                'Track your application status'
            ]}
        />

        <ActionButton href="/login" variant="green">
            Continue to Login
        </ActionButton>
    </StatusPageContainer>
);
