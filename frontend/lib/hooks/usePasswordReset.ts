import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export function usePasswordReset(tokenParam: string | null) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error('Invalid reset link');
      router.push('/forgot-password');
    }
  }, [tokenParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients/auth/reset-password`, {
        token,
        newPassword: password,
      });

      toast.success('✅ Password reset successfully! You can now log in.');
      router.push('/login');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Failed to reset password. The link may have expired.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    password,
    confirmPassword,
    isSubmitting,
    setPassword,
    setConfirmPassword,
    handleSubmit
  };
}
