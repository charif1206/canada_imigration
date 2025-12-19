import React from 'react';
import { UseFormRegister, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { UseMutationResult } from '@tanstack/react-query';
import { ContactFormData } from './types';
import { ContactFormField } from './ContactFormField';
import { SubmitButton } from './SubmitButton';
import { ContactEmailData } from '@/lib/hooks/useMessages';

interface ContactFormProps {
    register: UseFormRegister<ContactFormData>;
    handleSubmit: UseFormHandleSubmit<ContactFormData>;
    errors: FieldErrors<ContactFormData>;
    isSubmitting: boolean;
    onSubmit: (data: ContactFormData) => Promise<void>;
    sendEmailMutation: UseMutationResult<any, any, ContactEmailData, unknown>;
}

export const ContactForm: React.FC<ContactFormProps> = ({
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    sendEmailMutation
}) => {
    return (
        <div className="bg-white p-6 sm:p-8 text-black rounded-xl shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6">Envoyer un message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
                <ContactFormField
                    id="name"
                    label="Nom"
                    type="text"
                    register={register}
                    error={errors.name}
                />
                <ContactFormField
                    id="email"
                    label="Email"
                    type="email"
                    register={register}
                    error={errors.email}
                />
                <ContactFormField
                    id="message"
                    label="Message"
                    type="textarea"
                    register={register}
                    error={errors.message}
                    rows={4}
                />
                <SubmitButton 
                    isSubmitting={isSubmitting} 
                    isPending={sendEmailMutation.isPending} 
                />
            </form>
        </div>
    );
};
