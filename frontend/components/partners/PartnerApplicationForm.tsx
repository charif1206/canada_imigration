import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useSubmitPartnerForm } from '@/lib/hooks/useForms';

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

const initialFormData: FormData = {
    agencyName: '',
    managerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    clientCount: '',
    message: ''
};

export const PartnerApplicationForm: React.FC = () => {
    const partnerMutation = useSubmitPartnerForm();
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        partnerMutation.mutate(formData, {
            onSuccess: (data) => {
                toast.success(data.message || 'Partner application submitted successfully!');
                setFormData(initialFormData);
                window.scrollTo(0, 0);
            },
            onError: (error: Error & { response?: { data?: { message?: string } } }) => {
                console.error('Error submitting partner application:', error);
                const errorMessage = error.response?.data?.message || 
                    'Failed to submit application. Please try again.';
                toast.error(errorMessage);
            },
        });
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6" style={{ color: '#0A2540' }}>
                Formulaire d&apos;inscription – Agences de Voyages
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label htmlFor="agencyName" className="block text-xs sm:text-sm font-medium text-gray-700">
                        Nom de l&apos;agence
                    </label>
                    <input 
                        type="text" 
                        name="agencyName" 
                        id="agencyName" 
                        value={formData.agencyName} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base min-h-[44px]" 
                    />
                </div>
                
                <div>
                    <label htmlFor="managerName" className="block text-xs sm:text-sm font-medium text-gray-700">
                        Nom du responsable
                    </label>
                    <input 
                        type="text" 
                        name="managerName" 
                        id="managerName" 
                        value={formData.managerName} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base min-h-[44px]" 
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                        E-mail professionnel
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base min-h-[44px]" 
                    />
                </div>
                
                <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700">
                        Numéro WhatsApp / téléphone
                    </label>
                    <input 
                        type="tel" 
                        name="phone" 
                        id="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base min-h-[44px]" 
                    />
                </div>
                
                <div>
                    <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700">
                        Adresse complète
                    </label>
                    <input 
                        type="text" 
                        name="address" 
                        id="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base min-h-[44px]" 
                    />
                </div>
                
                <div>
                    <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700">
                        Ville / Wilaya
                    </label>
                    <input 
                        type="text" 
                        name="city" 
                        id="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base min-h-[44px]" 
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label htmlFor="clientCount" className="block text-xs sm:text-sm font-medium text-gray-700">
                        Nombre moyen de clients mensuels intéressés par le Canada
                    </label>
                    <input 
                        type="number" 
                        name="clientCount" 
                        id="clientCount" 
                        value={formData.clientCount} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base min-h-[44px]" 
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700">
                        Message ou commentaire libre
                    </label>
                    <textarea 
                        name="message" 
                        id="message" 
                        rows={4} 
                        value={formData.message} 
                        onChange={handleChange} 
                        className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-base"
                    />
                </div>
                
                <div className="md:col-span-2">
                    <button 
                        type="submit" 
                        disabled={partnerMutation.isPending}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-base"
                    >
                        {partnerMutation.isPending ? 'Envoi en cours...' : 'Soumettre mon inscription'}
                    </button>
                </div>
            </form>
        </div>
    );
};
