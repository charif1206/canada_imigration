import React from 'react';

interface AuthFormFieldProps {
    id: string;
    name: string;
    type: 'text' | 'email' | 'password';
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    extraLabel?: React.ReactNode;
}

export const AuthFormField: React.FC<AuthFormFieldProps> = ({
    id,
    name,
    type,
    label,
    value,
    onChange,
    placeholder,
    required = true,
    extraLabel
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {required && '*'}
                </label>
                {extraLabel}
            </div>
            <input
                id={id}
                name={name}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
                placeholder={placeholder}
            />
        </div>
    );
};
