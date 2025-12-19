import React from 'react';
import { InfoSection } from './InfoSection';
import { InfoField } from './InfoField';

interface ImmigrationInfoSectionProps {
    isValidated: boolean;
    validatedAt?: string;
}

export const ImmigrationInfoSection: React.FC<ImmigrationInfoSectionProps> = ({ 
    isValidated, 
    validatedAt 
}) => {
    const validationStatus = isValidated ? '✅ Validé' : '⏳ En attente';
    const formattedValidatedDate = validatedAt 
        ? new Date(validatedAt).toLocaleDateString('fr-FR')
        : null;

    return (
        <InfoSection title="Informations d'immigration">
            <InfoField label="Statut de validation" value={validationStatus} />
            {formattedValidatedDate && (
                <InfoField label="Validé le" value={formattedValidatedDate} />
            )}
        </InfoSection>
    );
};
