'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSendContactEmail } from '../../lib/hooks/useMessages';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'react-toastify';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

const ContactPage: React.FC = () => {
    const { user } = useAuth();
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ContactFormData>();
    const sendEmailMutation = useSendContactEmail();

    // Pre-fill email if user is logged in
    useEffect(() => {
        if (user?.email) {
            setValue('email', user.email);
            if (user.name) {
                setValue('name', user.name);
            }
        }
    }, [user, setValue]);

    const onSubmit = async (data: ContactFormData) => {
        try {
            await sendEmailMutation.mutateAsync(data);
            toast.success('✅ Message sent successfully! We will get back to you soon.');
            reset(); // Reset form after successful submission
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
            toast.error(`❌ ${errorMessage}`);
        }
    };

    return (
        <div className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-900">Contactez-nous dès aujourd&apos;hui !</h1>
                    <p className="text-lg text-slate-600 mt-2">Notre équipe vous répond dans les plus brefs délais pour vous aider dans votre projet d&apos;immigration.</p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-6">Envoyer un message</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    {...register('name', { 
                                        required: 'Le nom est requis',
                                        minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                                    })}
                                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    {...register('email', { 
                                        required: 'L\'email est requis',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Adresse email invalide'
                                        }
                                    })}
                                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    id="message" 
                                    rows={4} 
                                    {...register('message', { 
                                        required: 'Le message est requis',
                                        minLength: { value: 10, message: 'Le message doit contenir au moins 10 caractères' }
                                    })}
                                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm ${
                                        errors.message ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                ></textarea>
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                                )}
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || sendEmailMutation.isPending}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-red-300 disabled:cursor-not-allowed"
                                >
                                    {(isSubmitting || sendEmailMutation.isPending) ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Envoi en cours...
                                        </span>
                                    ) : (
                                        'Envoyer'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Direct Contact Info */}
                    <div className="bg-blue-900 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center text-start">
                        <h2 className="text-2xl font-bold mb-6">Contact Direct</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>Service 100% en ligne</span>
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:canadaguideimmigration@gmail.com" className="hover:text-red-300">Email: canadaguideimmigration@gmail.com</a>
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                <a href="https://wa.me/213000000000" className="hover:text-red-300">WhatsApp: +213 [Numéro]</a>
                            </div>
                        </div>
                        <div className="border-t border-blue-700 mt-8 pt-6">
                            <h3 className="text-lg font-semibold mb-3">Suivez-nous</h3>
                             <div className="flex space-x-4">
                               <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Facebook</a>
                               <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">Instagram</a>
                               <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">TikTok</a>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;