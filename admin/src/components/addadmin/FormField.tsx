/**
 * Form Field Component
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { RegisterAdminFormData } from '@/src/schemas/auth.schema';

interface FormFieldProps {
  id: keyof RegisterAdminFormData;
  label: string;
  type: string;
  placeholder: string;
  helpText?: string;
  autoComplete?: string;
  register: UseFormRegister<RegisterAdminFormData>;
  errors: FieldErrors<RegisterAdminFormData>;
  disabled?: boolean;
}

export default function FormField({
  id,
  label,
  type,
  placeholder,
  helpText,
  autoComplete,
  register,
  errors,
  disabled = false,
}: FormFieldProps) {
  const error = errors[id];
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helpText ? helpId : undefined}
        {...register(id)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
          {error.message as string}
        </p>
      ) : helpText ? (
        <p id={helpId} className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
