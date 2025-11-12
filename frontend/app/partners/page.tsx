'use client';

import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-6 h-6 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
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
    const { client, refreshAuth, isAuthenticated } = useAuth();
    
    // Temporary state to show pending immediately after submission (persisted in localStorage per user)
    const [isSendingTemporarilyPartner, setIsSendingTemporarilyPartner] = useState(() => {
        if (typeof window !== 'undefined' && client?.id) {
            return localStorage.getItem(`temp_sending_partner_${client.id}`) === 'true';
        }
        return false;
    });
    
    // Clear temporary flags when backend confirms submission OR clean up old user flags
    useEffect(() => {
        if (!client?.id) return;
        
        // Clean up flags from other users
        if (typeof window !== 'undefined') {
            const allKeys = Object.keys(localStorage);
            allKeys.forEach(key => {
                if (key.startsWith('temp_sending_partner_') && !key.includes(client.id)) {
                    localStorage.removeItem(key);
                }
            });
        }
        
        // Remove this user's temporary flag when backend confirms
        if (isSendingTemporarilyPartner && client?.isSendingPartners) {
            localStorage.removeItem(`temp_sending_partner_${client.id}`);
        }
    }, [client?.id, client?.isSendingPartners, isSendingTemporarilyPartner]);
    
    // Auto-refresh every 5 minutes to check for status updates
    useEffect(() => {
        if (isAuthenticated && client) {
            const interval = setInterval(() => {
                refreshAuth();
            }, 5 * 60 * 1000); // 5 minutes

            return () => clearInterval(interval);
        }
    }, [client, refreshAuth, isAuthenticated]);
    
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
        if (!client?.id) return;
        
        setIsSubmitting(true);
        // Set temporary flag in localStorage before submission (user-specific)
        localStorage.setItem(`temp_sending_partner_${client.id}`, 'true');
        setIsSendingTemporarilyPartner(true);
        
        try {
            // Get the JWT token from localStorage
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/partners`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.success) {
                toast.success('Partner application submitted successfully!');
                window.scrollTo(0, 0);
                // Refresh auth to get updated partner status
                setTimeout(() => {
                    refreshAuth();
                }, 1000);
            }
        } catch (error) {
            console.error('Error submitting partner application:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            toast.error(axiosError.response?.data?.message || 'Failed to submit application. Please try again.');
            // Remove temporary flag on error
            if (client?.id) {
                localStorage.removeItem(`temp_sending_partner_${client.id}`);
            }
            setIsSendingTemporarilyPartner(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate time remaining for rejected partner applications
    const calculateTimeRemaining = (rejectedAt: string): { canResubmit: boolean; hoursLeft: number; minutesLeft: number } => {
        const rejectedTime = new Date(rejectedAt).getTime();
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const elapsed = now - rejectedTime;
        const remaining = twentyFourHours - elapsed;
        
        if (remaining <= 0) {
            return { canResubmit: true, hoursLeft: 0, minutesLeft: 0 };
        }
        
        const hoursLeft = Math.floor(remaining / (60 * 60 * 1000));
        const minutesLeft = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        
        return { canResubmit: false, hoursLeft, minutesLeft };
    };

    // Check if user can resubmit partner form
    const canResubmitPartner = client?.partnerStatus !== 'rejected' || 
        (client?.partnerRejectedAt && calculateTimeRemaining(client.partnerRejectedAt).canResubmit);

    return (
        <ProtectedRoute>
            <div className="py-20" style={{ backgroundColor: '#F4F4F4' }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#0A2540' }}>🤝 Programme Partenaire pour Agences de Voyages</h1>
                        <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">Un partenariat gagnant pour accompagner vos clients vers le Canada.</p>
                    </div>

                {/* Show status message if form already submitted */}
                {((client?.isSendingPartners && !canResubmitPartner) || isSendingTemporarilyPartner) ? (
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
                        {(client?.partnerStatus === 'pending' || isSendingTemporarilyPartner) && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md">
                                <div className="flex items-center">
                                    <div className="shrink-0">
                                        <svg className="h-10 w-10 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-blue-800">⏳ Demande de partenariat en cours</h3>
                                        <p className="mt-2 text-sm text-blue-700">
                                            Votre demande de partenariat est en cours de traitement. Notre équipe vous contactera sous 24 heures pour organiser une réunion de présentation et discuter des tarifs, modalités de collaboration et avantages partenaires.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {client?.partnerStatus === 'validated' && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md">
                                <div className="flex items-center">
                                    <div className="shrink-0">
                                        <svg className="h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-green-800">✅ Partenariat approuvé !</h3>
                                        <p className="mt-2 text-sm text-green-700">
                                            Félicitations ! Votre demande de partenariat a été approuvée. Un conseiller vous contactera prochainement pour finaliser les modalités de collaboration.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {client?.partnerStatus === 'rejected' && client?.partnerRejectedAt && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
                                <div className="flex items-center">
                                    <div className="shrink-0">
                                        <svg className="h-10 w-10 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-red-800">❌ Demande de partenariat rejetée</h3>
                                        {client?.partnerRejectionReason && (
                                            <p className="mt-2 text-sm text-red-700">
                                                <strong>Raison :</strong> {client.partnerRejectionReason}
                                            </p>
                                        )}
                                        {(() => {
                                            const { canResubmit, hoursLeft, minutesLeft } = calculateTimeRemaining(client.partnerRejectedAt);
                                            return !canResubmit ? (
                                                <p className="mt-2 text-sm font-semibold text-red-800">
                                                    🕒 Vous pouvez soumettre à nouveau après {hoursLeft}h {minutesLeft}min
                                                </p>
                                            ) : (
                                                <p className="mt-2 text-sm font-semibold text-green-700">
                                                    ✅ Vous pouvez maintenant soumettre à nouveau
                                                </p>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {client?.partnerStatus === 'rejected' && canResubmitPartner && (
                            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md max-w-4xl mx-auto">
                                <p className="text-sm text-yellow-700">
                                    ℹ️ Votre précédente demande a été rejetée. Vous pouvez maintenant soumettre à nouveau avec les corrections nécessaires.
                                </p>
                            </div>
                        )}
                        
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
        </ProtectedRoute>
    );
};

export default PartnersPage;