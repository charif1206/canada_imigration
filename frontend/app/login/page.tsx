'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authUtils } from '../../lib/auth';

const API_URL = 'http://localhost:3000';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'id'>('email');
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or client ID
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let clientId = formData.identifier;
      let client;

      if (loginMethod === 'email') {
        // Search for client by email
        const response = await fetch(`${API_URL}/clients`);
        const clients = await response.json();
        
        interface ClientData {
          id: string;
          email: string;
          [key: string]: unknown;
        }
        
        client = clients.find((c: ClientData) => c.email.toLowerCase() === formData.identifier.toLowerCase());
        
        if (!client) {
          throw new Error('No account found with this email address');
        }
        
        clientId = client.id;
      } else {
        // Fetch client by ID
        const response = await fetch(`${API_URL}/clients/${formData.identifier}`);
        
        if (!response.ok) {
          throw new Error('Invalid Client ID');
        }
        
        client = await response.json();
      }

      // Store client data
      authUtils.setAuth(clientId, client);

      // Redirect to status page
      router.push('/status');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-blue-900">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🍁 Client Login
          </h1>
          <p className="text-gray-600">
            Access your immigration application status
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Login Method Selector */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('id')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === 'id'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Client ID
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              {loginMethod === 'email' ? 'Email Address' : 'Client ID'}
            </label>
            <input
              id="identifier"
              name="identifier"
              type={loginMethod === 'email' ? 'email' : 'text'}
              required
              value={formData.identifier}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={loginMethod === 'email' ? 'your@email.com' : 'Your Client ID'}
            />
            {loginMethod === 'id' && (
              <p className="mt-2 text-sm text-gray-500">
                You received your Client ID via email after registration
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
