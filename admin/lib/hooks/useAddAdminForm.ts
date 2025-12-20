/**
 * Add Admin Form Hook
 * Manages form state and submission
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerAdminSchema, type RegisterAdminFormData } from '@/src/schemas/auth.schema';
import { useRegisterAdmin } from '@/src/hooks/useAuth';
import { prepareRegistrationData } from '@/lib/utils/formData.utils';
import { FORM_DEFAULTS } from '@/lib/constants/addAdmin.constants';

export function useAddAdminForm() {
  const { mutate: registerAdmin, isPending, isSuccess } = useRegisterAdmin();

  const form = useForm<RegisterAdminFormData>({
    resolver: zodResolver(registerAdminSchema),
    mode: 'onChange',
    defaultValues: FORM_DEFAULTS,
  });

  // Reset form on success
  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, form]);

  const onSubmit = (data: RegisterAdminFormData) => {
    const registerData = prepareRegistrationData(data);
    registerAdmin(registerData);
  };

  return {
    form,
    isPending,
    isSuccess,
    onSubmit,
  };
}
