'use client';

import { useAuthStore } from '@/src/stores/auth.store';
import { usePermissionCheck } from '@/lib/hooks/usePermissionCheck';
import { useAddAdminForm } from '@/lib/hooks/useAddAdminForm';
import { FORM_FIELDS } from '@/lib/constants/addAdmin.constants';
import AddAdminHeader from '@/src/components/addadmin/AddAdminHeader';
import LoadingState from '@/src/components/addadmin/LoadingState';
import SuccessAlert from '@/src/components/addadmin/SuccessAlert';
import FormField from '@/src/components/addadmin/FormField';
import RoleSelect from '@/src/components/addadmin/RoleSelect';
import FormActions from '@/src/components/addadmin/FormActions';
import SecurityNotice from '@/src/components/addadmin/SecurityNotice';

export default function AddAdminPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const { hasAccess } = usePermissionCheck(isAuthenticated, user);
  const { form, isPending, isSuccess, onSubmit } = useAddAdminForm();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  // Show loading state while checking permissions
  if (!hasAccess) {
    return <LoadingState isAuthenticated={isAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AddAdminHeader user={user} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {isSuccess && <SuccessAlert />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black" noValidate>
            <FormField
              id="username"
              label={FORM_FIELDS.USERNAME.label}
              type="text"
              placeholder={FORM_FIELDS.USERNAME.placeholder}
              helpText={FORM_FIELDS.USERNAME.helpText}
              autoComplete={FORM_FIELDS.USERNAME.autoComplete}
              register={register}
              errors={errors}
              disabled={isPending || isSuccess}
            />

            <FormField
              id="email"
              label={FORM_FIELDS.EMAIL.label}
              type="email"
              placeholder={FORM_FIELDS.EMAIL.placeholder}
              helpText={FORM_FIELDS.EMAIL.helpText}
              autoComplete={FORM_FIELDS.EMAIL.autoComplete}
              register={register}
              errors={errors}
              disabled={isPending || isSuccess}
            />

            <FormField
              id="password"
              label={FORM_FIELDS.PASSWORD.label}
              type="password"
              placeholder={FORM_FIELDS.PASSWORD.placeholder}
              helpText={FORM_FIELDS.PASSWORD.helpText}
              autoComplete={FORM_FIELDS.PASSWORD.autoComplete}
              register={register}
              errors={errors}
              disabled={isPending || isSuccess}
            />

            <FormField
              id="confirmPassword"
              label={FORM_FIELDS.CONFIRM_PASSWORD.label}
              type="password"
              placeholder={FORM_FIELDS.CONFIRM_PASSWORD.placeholder}
              autoComplete={FORM_FIELDS.CONFIRM_PASSWORD.autoComplete}
              register={register}
              errors={errors}
              disabled={isPending || isSuccess}
            />

            <RoleSelect register={register} errors={errors} disabled={isPending || isSuccess} />

            <FormActions isPending={isPending} isSuccess={isSuccess} isValid={isValid} />
          </form>

          <SecurityNotice />
        </div>
      </main>
    </div>
  );
}
