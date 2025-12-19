import React from 'react';
import { StatusPageContainer, IconCircle, StatusHeading, InfoBox, ActionButton } from '../status';

const EmailIcon = () => (
    <svg className="w-full h-full text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export const AwaitingVerificationState: React.FC = () => (
    <StatusPageContainer gradientFrom="blue-600" gradientTo="purple-600">
        <IconCircle variant="blue" size="md">
            <EmailIcon />
        </IconCircle>
        
        <StatusHeading
            emoji="📧"
            title="Check Your Email"
            subtitle="We've sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to activate your account."
        />

        <InfoBox
            variant="blue"
            title="Didn't receive the email?"
            items={[
                'Check your spam/junk folder',
                'Make sure you entered the correct email address',
                'Wait a few minutes and refresh your inbox',
                'The verification link is valid for 24 hours'
            ]}
        />

        <div className="space-y-3">
            <ActionButton href="/login" variant="blue">
                Go to Login Page
            </ActionButton>
            
            <ActionButton href="/register" variant="gray">
                Register with Different Email
            </ActionButton>
        </div>
    </StatusPageContainer>
);
