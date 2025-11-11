/**
 * Validation Modal Component
 * Clean UI component with React Hook Form and Zod validation
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateClientSchema, ValidateClientFormData } from '@/src/schemas/client.schema';
import { Client } from '@/src/types/client.types';
import { useValidateClient } from '@/src/hooks/useClients';
import { useEffect } from 'react';

interface ValidationModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ValidationModal({
  client,
  isOpen,
  onClose,
}: ValidationModalProps) {
  const { mutate: validateClient, isPending } = useValidateClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValidateClientFormData>({
    resolver: zodResolver(validateClientSchema),
  });

  // Reset form when modal closes or client changes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen || !client) return null;

  const onSubmit = (data: ValidateClientFormData) => {
    validateClient(
      { clientId: client.id, data },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Validate Client
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isPending}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Confirm validation for this client
            </p>
          </div>

          {/* Client Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Name:</span>
              <span className="text-sm font-semibold text-gray-900">
                {client.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <span className="text-sm font-semibold text-gray-900">
                {client.email}
              </span>
            </div>
            {client.passportNumber && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Passport:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {client.passportNumber}
                </span>
              </div>
            )}
            {client.nationality && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Nationality:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {client.nationality}
                </span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Notes Field */}
            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Validation Notes (Optional)
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Add any notes about this validation..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                disabled={isPending}
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Validating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Validate Client
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
