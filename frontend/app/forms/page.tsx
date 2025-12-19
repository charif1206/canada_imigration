'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

const FormsPage: React.FC = () => {
    return (
        <ProtectedRoute>
            <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900 mb-4">
                            📝 Formulaires de services
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                            Choisissez le formulaire correspondant à votre besoin
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Equivalence Form Card */}
                        <Link href="/forms/equivalence">
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 cursor-pointer border-2 border-transparent hover:border-blue-500">
                                <div className="text-center">
                                    <div className="text-6xl mb-6">🎓</div>
                                    <h2 className="text-2xl font-bold text-blue-900 mb-4">
                                        Équivalence de diplôme
                                    </h2>
                                    <p className="text-slate-600 mb-6 leading-relaxed">
                                        Fournissez les informations nécessaires pour la demande d&apos;équivalence de votre diplôme
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                                        Accéder au formulaire
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Residence Form Card */}
                        <Link href="/forms/residence">
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 cursor-pointer border-2 border-transparent hover:border-blue-500">
                                <div className="text-center">
                                    <div className="text-6xl mb-6">🧩</div>
                                    <h2 className="text-2xl font-bold text-blue-900 mb-4">
                                        Résidence Permanente
                                    </h2>
                                    <p className="text-slate-600 mb-6 leading-relaxed">
                                        Mettez à jour votre dossier de résidence permanente (CSQ et Fédéral)
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                                        Accéder au formulaire
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Help Section */}
                    <div className="mt-16 text-center">
                        <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-blue-900 mb-3">
                                💡 Besoin d&apos;aide ?
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Si vous avez des questions concernant les formulaires, n&apos;hésitez pas à nous contacter
                            </p>
                            <Link
                                href="/contact"
                                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default FormsPage;