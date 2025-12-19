import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { ContactFormData } from './types';

interface ContactFormFieldProps {
    id: keyof ContactFormData;
    label: string;
    type?: 'text' | 'email' | 'textarea';
    register: UseFormRegister<ContactFormData>;
    error?: FieldError;
    rows?: number;
    required?: boolean;
}

export const ContactFormField: React.FC<ContactFormFieldProps> = ({
    id,
    label,
    type = 'text',
    register,
    error,
    rows = 4,
    required = true
}) => {
    const getValidation = () => {
        const rules: any = {};
        
        if (required) {
            rules.required = `${label} est requis`;
        }

        if (id === 'name') {
            rules.minLength = { value: 2, message: 'Le nom doit contenir au moins 2 caractères' };
        }

        if (id === 'email') {
            rules.pattern = {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide'
            };
        }

        if (id === 'message') {
            rules.minLength = { value: 10, message: 'Le message doit contenir au moins 10 caractères' };
        }

        return rules;
    };

    const baseClassName = `mt-1 block w-full px-3 py-2 sm:py-3 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base ${
        error ? 'border-red-500' : 'border-gray-300'
    }`;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    rows={rows}
                    {...register(id, getValidation())}
                    className={baseClassName}
                />
            ) : (
                <input
                    type={type}
                    id={id}
                    {...register(id, getValidation())}
                    className={`${baseClassName} min-h-[44px]`}
                />
            )}
            {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
        </div>
    );
};
