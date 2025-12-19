import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

type VerificationStatus = 'loading' | 'success' | 'error' | 'already-verified' | 'awaiting-verification';

export function useEmailVerification(token: string | null, justRegistered: boolean) {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (justRegistered) {
      setStatus('awaiting-verification');
      setMessage('Please check your email for the verification link');
      return;
    }

    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        toast.error('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/clients/auth/verify-email`,
          { params: { token } }
        );

        if (response.data.alreadyVerified) {
          setStatus('already-verified');
          setMessage('Email already verified');
        } else {
          setStatus('success');
          setMessage('Email verified successfully!');
          toast.success('✅ Email verified! You can now log in.');
        }
      } catch (error: unknown) {
        setStatus('error');
        const axiosError = error as { response?: { data?: { message?: string } } };
        const errorMessage = axiosError.response?.data?.message || 'Verification failed. The link may have expired.';
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmail();
  }, [token, justRegistered]);

  return { status, message };
}
