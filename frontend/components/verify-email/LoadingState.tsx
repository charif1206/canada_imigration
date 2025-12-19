import React from 'react';
import { StatusPageContainer, IconCircle, StatusHeading } from '../status';

const MailIcon = () => (
    <svg className="w-full h-full text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
    </svg>
);

export const LoadingState: React.FC = () => (
    <StatusPageContainer gradientFrom="blue-600" gradientTo="purple-600">
        <IconCircle variant="blue" size="sm" animate>
            <MailIcon />
        </IconCircle>
        
        <StatusHeading
            title="Verifying Your Email..."
            subtitle="Please wait while we verify your email address."
        />

        <div className="mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
    </StatusPageContainer>
);
