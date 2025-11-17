'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified' | 'awaiting-verification'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user just registered (coming from registration page)
    const justRegistered = searchParams.get('registered');
    
    if (justRegistered === 'true') {
      setStatus('awaiting-verification');
      setMessage('Please check your email for the verification link');
      return;
    }

    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        toast.error('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/clients/auth/verify-email`,
          {
            params: { token },
          }
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
  }, [searchParams]);

  if (status === 'awaiting-verification') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-purple-600 py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            📧 Check Your Email
          </h1>
          
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to activate your account.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Didn&apos;t receive the email?</strong>
              <br />
              • Check your spam/junk folder
              <br />
              • Make sure you entered the correct email address
              <br />
              • Wait a few minutes and refresh your inbox
              <br />
              • The verification link is valid for 24 hours
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full inline-block bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Login Page
            </Link>
            
            <Link
              href="/register"
              className="w-full inline-block bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Register with Different Email
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-purple-600 py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Verifying Your Email...
          </h1>
          
          <p className="text-gray-600">
            Please wait while we verify your email address.
          </p>

          <div className="mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-600 to-teal-600 py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Email Verified!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now access all features of Canada Immigration Services.
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left">
            <p className="text-sm text-green-800">
              <strong>What&apos;s next?</strong>
              <br />
              • Log in to your account
              <br />
              • Complete your profile
              <br />
              • Submit your immigration application
              <br />
              • Track your application status
            </p>
          </div>

          <Link
            href="/login"
            className="w-full inline-block bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Continue to Login
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'already-verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-600 to-orange-600 py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Already Verified
          </h1>
          
          <p className="text-gray-600 mb-6">
            This email address has already been verified. You can log in to your account.
          </p>

          <Link
            href="/login"
            className="w-full inline-block bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-600 to-pink-600 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Verification Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
          <p className="text-sm text-red-800">
            <strong>What can you do?</strong>
            <br />
            • Request a new verification link
            <br />
            • Check if the link has expired
            <br />
            • Contact support if the problem persists
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/forgot-password"
            className="w-full inline-block bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Request New Link
          </Link>
          
          <Link
            href="/login"
            className="w-full inline-block bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
