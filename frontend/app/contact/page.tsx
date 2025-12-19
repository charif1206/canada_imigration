'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSendContactEmail } from '@/lib/hooks/useMessages';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'react-toastify';
import { 
    ContactForm, 
    DirectContactInfo, 
    PageHeader, 
    ContactFormData 
} from '@/components/contact';

const ContactPage: React.FC = () => {
    const { client } = useAuth();
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ContactFormData>();
    const sendEmailMutation = useSendContactEmail();

    // Pre-fill email if user is logged in
    useEffect(() => {
        if (client?.email) {
            setValue('email', client.email);
            if (client.name) {
                setValue('name', client.name);
            }
        }
    }, [client, setValue]);

    const onSubmit = async (data: ContactFormData) => {
        try {
            await sendEmailMutation.mutateAsync(data);
            toast.success('✅ Message sent successfully! We will get back to you soon.');
            reset();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
            toast.error(`❌ ${errorMessage}`);
        }
    };

    return (
        <div className="py-12 sm:py-16 md:py-20 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader />
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <ContactForm
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        onSubmit={onSubmit}
                        sendEmailMutation={sendEmailMutation}
                    />
                    <DirectContactInfo />
                </div>
            </div>
        </div>
    );
};

export default ContactPage;