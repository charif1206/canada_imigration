import React from 'react';
import { CheckListItem } from './CheckListItem';

interface PartnerBenefitsSectionProps {
    onScrollToForm: () => void;
}

export const PartnerBenefitsSection: React.FC<PartnerBenefitsSectionProps> = ({ 
    onScrollToForm 
}) => (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="md:pr-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#0A2540' }}>
                Un service clé en main pour vos clients
            </h2>
            <p className="text-slate-600 mb-6">
                Chez Canada Guide Immigration, nous collaborons avec des agences de voyages souhaitant offrir à leurs clients un accompagnement complet dans leur projet d&apos;immigration au Canada. Notre équipe prend en charge toutes les étapes du processus :
            </p>
            <ul className="space-y-3 text-slate-700 mb-6">
                <CheckListItem>Évaluation de profil</CheckListItem>
                <CheckListItem>Préparation TCF Canada</CheckListItem>
                <CheckListItem>Équivalence de diplômes</CheckListItem>
                <CheckListItem>Dossier CSQ</CheckListItem>
                <CheckListItem>Suivi fédéral jusqu&apos;à la résidence permanente</CheckListItem>
            </ul>
            <p className="text-slate-600">
                Vous, en tant qu&apos;agence, conservez la relation directe avec vos clients, tandis que nous assurons le suivi professionnel, rapide et conforme aux exigences canadiennes.
            </p>
        </div>
        <div>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0A2540' }}>
                    Nous garantissons :
                </h3>
                <ul className="space-y-3 text-slate-800">
                    <CheckListItem>Une structure administrative solide</CheckListItem>
                    <CheckListItem>Un accompagnement personnalisé pour chaque dossier</CheckListItem>
                    <CheckListItem>Une rémunération transparente pour chaque client référé</CheckListItem>
                </ul>
            </div>
            <div className="mt-8 text-center">
                <button 
                    onClick={onScrollToForm} 
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 min-h-[44px]"
                >
                    👉 Devenir partenaire
                </button>
            </div>
        </div>
    </div>
);
