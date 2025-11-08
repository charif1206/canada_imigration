'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start text-start">
        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <span>{children}</span>
    </li>
);

const HomePage: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="bg-white" style={{ backgroundImage: `url('https://picsum.photos/1920/1080?grayscale&blur=2')` }}>
                <div className="bg-blue-900 bg-opacity-70">
                    <div className="container mx-auto px-4 py-24 text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                            Réalisez votre rêve canadien avec un accompagnement complet de A à Z
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto mb-8">
                            Équivalence de diplômes, préparation TCF Canada, suivi CSQ et Fédéral — tout votre parcours d'immigration simplifié en un seul endroit.
                        </p>
                        {!user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href="/register"
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 inline-block"
                                >
                                    Commencer votre parcours
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-white hover:bg-gray-100 text-blue-900 font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 inline-block"
                                >
                                    Accès client
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Pourquoi nous choisir Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Pourquoi nous choisir ?</h2>
                        <p className="text-slate-600 mt-2">Votre succès est notre priorité.</p>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <ul className="space-y-4 text-slate-700">
                                <CheckListItem>Expertise dans le TCF Canada et le CSQ</CheckListItem>
                                <CheckListItem>Accompagnement personnalisé selon votre profil</CheckListItem>
                                <CheckListItem>Suivi complet jusqu'à la résidence permanente</CheckListItem>
                                <CheckListItem>Service 100 % en ligne</CheckListItem>
                            </ul>
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://picsum.photos/500/300?gravity=north" alt="Canada landscape" className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Témoignages</h2>
                    <p className="text-slate-600 mb-10">Ce que nos clients disent de nous (à venir).</p>
                    <div className="max-w-3xl mx-auto bg-slate-100 p-8 rounded-lg shadow-md italic">
                        <p className="text-slate-700 text-lg">
                            "Grâce à Canada Guide Immigration, j'ai obtenu mon CSQ et ma résidence permanente sans stress !"
                        </p>
                        <p className="text-end mt-4 font-semibold text-blue-900">- Client satisfait</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;