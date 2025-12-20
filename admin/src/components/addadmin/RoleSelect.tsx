/**
 * Role Select Component
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { RegisterAdminFormData } from '@/src/schemas/auth.schema';
import { FORM_FIELDS, ROLE_OPTIONS } from '@/lib/constants/addAdmin.constants';

interface RoleSelectProps {
  register: UseFormRegister<RegisterAdminFormData>;
  errors: FieldErrors<RegisterAdminFormData>;
  disabled?: boolean;
}

export default function RoleSelect({ register, errors, disabled = false }: RoleSelectProps) {
  const error = errors.role;
  const errorId = 'role-error';
  const helpId = 'role-help';

  return (
    <div>
      <label htmlFor={FORM_FIELDS.ROLE.id} className="block text-sm font-medium text-gray-700 mb-2">
        {FORM_FIELDS.ROLE.label} <span className="text-red-500">*</span>
      </label>
      <select
        id={FORM_FIELDS.ROLE.id}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helpId}
        {...register('role')}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
        disabled={disabled}
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
          {error.message as string}
        </p>
      ) : (
        <p id={helpId} className="mt-2 text-sm text-gray-500">
          {FORM_FIELDS.ROLE.helpText}
        </p>
      )}
    </div>
  );
}
