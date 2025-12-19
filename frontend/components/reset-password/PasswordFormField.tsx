import React from 'react';

interface PasswordFormFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    helperText?: string;
}

export const PasswordFormField: React.FC<PasswordFormFieldProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder = '••••••••',
    helperText
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <input
            id={id}
            name={id}
            type="password"
            required
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base min-h-[44px]"
            placeholder={placeholder}
            minLength={6}
        />
        {helperText && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
    </div>
);
