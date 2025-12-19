import React from 'react';
import { InfoSection } from './InfoSection';
import { InfoField } from './InfoField';

interface PersonalInfoSectionProps {
    email: string;
    createdAt?: string;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
    email, 
    createdAt 
}) => {
    const formattedDate = createdAt 
        ? new Date(createdAt).toLocaleDateString('fr-FR')
        : 'Non renseigné';

    return (
        <InfoSection title="Informations personnelles">
            <InfoField label="Email" value={email} />
            <InfoField label="Membre depuis" value={formattedDate} />
        </InfoSection>
    );
};
