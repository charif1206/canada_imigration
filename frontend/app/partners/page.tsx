'use client';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <span>{children}</span>
    </li>
);

interface FormData {
    agencyName: string;
    managerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    clientCount: string;
    message: string;
}

const PartnersPage: React.FC = () => {
    const formRef = useRef<HTMLDivElement>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        agencyName: '', managerName: '', email: '', phone: '',
        address: '', city: '', clientCount: '', message: ''
    });

    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/partners`, formData);
            
            if (response.data.success) {
                setIsSubmitted(true);
                toast.success('Partner application submitted successfully!');
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Error submitting partner application:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            toast.error(axiosError.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-20" style={{ backgroundColor: '#F4F4F4' }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#0A2540' }}>🤝 Programme Partenaire pour Agences de Voyages</h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">Un partenariat gagnant pour accompagner vos clients vers le Canada.</p>
                </div>

                {isSubmitted ? (
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Inscription Réussie !</h2>
                        <p className="text-slate-700 mb-6">Bonjour {formData.managerName}, merci pour votre inscription. Voici un résumé des prochaines étapes :</p>
                        
                        <div className="text-start space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h3 className="font-bold text-lg mb-2" style={{color: '#0A2540'}}>📧 Confirmation par E-mail (Envoyée à {formData.email})</h3>
                                <p className="text-sm text-slate-600 italic"><strong>Objet :</strong> Merci pour votre inscription au programme partenaire Canada Guide Immigration</p>
                                <p className="mt-2 text-slate-700">Notre équipe vous contactera sous 24 heures pour organiser une réunion de présentation et discuter des tarifs, modalités de collaboration et avantages partenaires.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h3 className="font-bold text-lg mb-2" style={{color: '#0A2540'}}>📱 Message WhatsApp (Envoyé au {formData.phone})</h3>
                                <p className="mt-2 text-slate-700">« Merci pour votre inscription au programme partenaire Canada Guide Immigration. Un conseiller vous contactera sous 24 heures pour organiser une réunion et discuter des modalités de collaboration. »</p>
                            </div>
                        </div>

                        <p className="mt-8 text-slate-600">Nous sommes ravis de collaborer avec votre agence pour offrir à vos clients un service d&apos;immigration complet, professionnel et fiable.</p>
                        <p className="mt-2 font-semibold" style={{color: '#0A2540'}}>L&apos;équipe Canada Guide Immigration</p>
                    </div>
                ) : (
                    <>
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-xl shadow-lg">
                            <div className="md:pr-8">
                                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0A2540' }}>Un service clé en main pour vos clients</h2>
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
                                    <h3 className="text-xl font-bold mb-3" style={{ color: '#0A2540' }}>Nous garantissons :</h3>
                                    <ul className="space-y-3 text-slate-800">
                                        <CheckListItem>Une structure administrative solide</CheckListItem>
                                        <CheckListItem>Un accompagnement personnalisé pour chaque dossier</CheckListItem>
                                        <CheckListItem>Une rémunération transparente pour chaque client référé</CheckListItem>
                                    </ul>
                                </div>
                                <div className="mt-8 text-center">
                                    <button onClick={handleScrollToForm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
                                        👉 Devenir partenaire
                                    </button>
                                </div>
                            </div>
                        </div>
        
                        <div ref={formRef} className="mt-16 max-w-4xl mx-auto scroll-mt-24">
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#0A2540' }}>Formulaire d&apos;inscription – Agences de Voyages</h2>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">Nom de l&apos;agence</label>
                                        <input type="text" name="agencyName" id="agencyName" value={formData.agencyName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="managerName" className="block text-sm font-medium text-gray-700">Nom du responsable</label>
                                        <input type="text" name="managerName" id="managerName" value={formData.managerName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail professionnel</label>
                                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                     <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Numéro WhatsApp / téléphone</label>
                                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse complète</label>
                                        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville / Wilaya</label>
                                        <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="clientCount" className="block text-sm font-medium text-gray-700">Nombre moyen de clients mensuels intéressés par le Canada</label>
                                        <input type="number" name="clientCount" id="clientCount" value={formData.clientCount} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message ou commentaire libre</label>
                                        <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Envoi en cours...' : 'Soumettre mon inscription'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PartnersPage;