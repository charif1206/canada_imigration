import React from 'react';

interface EmailFormFieldProps {
    email: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmailFormField: React.FC<EmailFormFieldProps> = ({ email, onChange }) => (
    <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
        </label>
        <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base min-h-[44px]"
            placeholder="your.email@example.com"
        />
    </div>
);
