import React from 'react';
import { CheckListItem } from './CheckListItem';

const BENEFITS = [
    'Expertise dans le TCF Canada et le CSQ',
    'Accompagnement personnalisé selon votre profil',
    'Suivi complet jusqu\'à la résidence permanente',
    'Service 100 % en ligne',
];

const IMAGE_URL = 'https://picsum.photos/500/300?gravity=north';
const IMAGE_ALT = 'Canada landscape';

export const WhyChooseUsSection: React.FC = () => {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">
                        Pourquoi nous choisir ?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-2">
                        Votre succès est notre priorité.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                        <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-700">
                            {BENEFITS.map((benefit, index) => (
                                <CheckListItem key={index}>{benefit}</CheckListItem>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-center">
                        <img
                            src={IMAGE_URL}
                            alt={IMAGE_ALT}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
