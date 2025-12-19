import React from 'react';
import { StatusPageContainer, IconCircle, StatusHeading, InfoBox, ActionButton } from '../status';

interface SuccessMessageProps {
    email: string;
    onSendAgain: () => void;
}

const EmailIcon = () => (
    <svg className="w-full h-full text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
    </svg>
);

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ email, onSendAgain }) => (
    <StatusPageContainer gradientFrom="blue-600" gradientTo="blue-900">
        <IconCircle variant="green" size="md">
            <EmailIcon />
        </IconCircle>

        <StatusHeading
            emoji="📧"
            title="Check Your Email!"
            subtitle={
                <>
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Please check your inbox and click the link to reset your password.
                </>
            }
        />

        <InfoBox
            variant="blue"
            title="Didn't receive the email?"
            items={[
                'Check your spam/junk folder',
                'The link expires in 1 hour',
                'You can request a new link below'
            ]}
        />

        <div className="space-y-3">
            <ActionButton onClick={onSendAgain} variant="blue">
                Send Again
            </ActionButton>

            <ActionButton href="/login" variant="gray">
                ← Back to Login
            </ActionButton>
        </div>
    </StatusPageContainer>
);
