import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
    isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated }) => {
    return (
        <section
            className="bg-white"
            style={{ backgroundImage: `url('https://picsum.photos/1920/1080?grayscale&blur=2')` }}
        >
            <div className="bg-blue-900 bg-opacity-70">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                        Réalisez votre rêve canadien avec un accompagnement complet de A à Z
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto mb-8">
                        Équivalence de diplômes, préparation TCF Canada, suivi CSQ et Fédéral — tout votre
                        parcours d'immigration simplifié en un seul endroit.
                    </p>
                    {isAuthenticated ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/forms/equivalence"
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 inline-block text-center min-h-[44px]"
                            >
                                📋 Commencer l'équivalence de diplôme
                            </Link>
                            <Link
                                href="/profile"
                                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-blue-900 font-bold py-3 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 inline-block text-center min-h-[44px]"
                            >
                                Mon profil
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 inline-block text-center min-h-[44px]"
                            >
                                Commencer votre parcours
                            </Link>
                            <Link
                                href="/login"
                                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-blue-900 font-bold py-3 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 inline-block text-center min-h-[44px]"
                            >
                                Accès client
                            </Link>
                        </div>
                    )}\n                </div>
            </div>
        </section>
    );
};
