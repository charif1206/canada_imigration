import React from 'react';
import { ProfileBanner } from './ProfileBanner';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ImmigrationInfoSection } from './ImmigrationInfoSection';

interface ProfileInfoCardProps {
    name: string;
    email: string;
    isValidated: boolean;
    createdAt?: string;
    validatedAt?: string;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
    name,
    email,
    isValidated,
    createdAt,
    validatedAt
}) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 sm:mb-8">
        <ProfileBanner name={name} email={email} isValidated={isValidated} />
        
        <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <PersonalInfoSection email={email} createdAt={createdAt} />
                <ImmigrationInfoSection isValidated={isValidated} validatedAt={validatedAt} />
            </div>
        </div>
    </div>
);
