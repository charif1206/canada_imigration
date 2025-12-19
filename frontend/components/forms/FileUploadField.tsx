import React from 'react';

interface FileUploadFieldProps {
    label: string;
    name: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    required?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
    label,
    name,
    file,
    onChange,
    accept = '.pdf',
    required = false
}) => (
    <div className="md:col-span-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type="file"
            name={name}
            id={name}
            accept={accept}
            onChange={onChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />
        {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
    </div>
);
