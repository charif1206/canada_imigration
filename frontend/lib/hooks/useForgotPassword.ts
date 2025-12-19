import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients/auth/forgot-password`, {
        email,
      });

      setIsSubmitted(true);
      toast.success('📧 Password reset link sent! Check your email.');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => setIsSubmitted(false);

  return {
    email,
    isSubmitting,
    isSubmitted,
    setEmail,
    handleSubmit,
    resetForm
  };
}
