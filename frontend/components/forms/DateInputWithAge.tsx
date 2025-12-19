import React from 'react';

interface DateInputWithAgeProps {
    label: string;
    name: string;
    value: string;
    age: number | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
}

export const DateInputWithAge: React.FC<DateInputWithAgeProps> = ({
    label,
    name,
    value,
    age,
    onChange,
    required = true,
    error
}) => (
    <div>
        <label htmlFor={name} className="block text-xs sm:text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2">
            <input
                type="date"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`mt-1 block w-full px-3 py-2 sm:py-3 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base transition min-h-[44px] ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {age !== null && (
                <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                        age >= 18 ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {age} ans
                </span>
            )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);
