import React from 'react';
import { ProfileAvatar } from './ProfileAvatar';
import { ValidationBadge } from './ValidationBadge';

interface ProfileBannerProps {
    name: string;
    email: string;
    isValidated: boolean;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({ 
    name, 
    email, 
    isValidated 
}) => (
    <div className="bg-linear-to-r from-blue-900 to-red-600 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <ProfileAvatar />
        <div className="text-white text-center sm:text-left">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-blue-100 mt-1">{email}</p>
            <ValidationBadge isValidated={isValidated} />
        </div>
    </div>
);
