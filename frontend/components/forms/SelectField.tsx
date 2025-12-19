import React from 'react';

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    placeholder: string;
    error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    required = true,
    placeholder,
    error
}) => (
    <div>
        <label htmlFor={name} className="block text-xs sm:text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`mt-1 block w-full pl-3 pr-10 py-2 sm:py-3 text-sm sm:text-base border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent rounded-md transition min-h-[44px] ${
                error ? 'border-red-500' : 'border-gray-300'
            }`}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);
