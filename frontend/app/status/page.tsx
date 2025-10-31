'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/useAuth';

const API_URL = 'http://localhost:3000';

interface Message {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function StatusPage() {
  const { isAuthenticated, isLoading, client, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !client) return;

    const loadMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/clients/${client.id}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setMessagesLoading(false);
      }
    };

    void loadMessages();
  }, [isAuthenticated, client]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`${API_URL}/clients/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: client.id,
          subject: messageForm.subject,
          content: messageForm.content,
        }),
      });

      if (response.ok) {
        setMessageForm({ subject: '', content: '' });
        setShowMessageForm(false);
        // Reload messages
        const messagesResponse = await fetch(`${API_URL}/clients/${client.id}/messages`);
        const data = await messagesResponse.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🍁 Application Status</h1>
              <p className="text-blue-100">Track your immigration application</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Welcome,</p>
                <p className="font-semibold">{client.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Client Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Client ID</p>
              <p className="font-medium text-gray-800">{client.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{client.phone}</p>
            </div>
            {client.immigrationType && (
              <div>
                <p className="text-sm text-gray-500">Immigration Type</p>
                <p className="font-medium text-gray-800 capitalize">
                  {client.immigrationType.replace('-', ' ')}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Application Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  client.isValidated
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {client.isValidated ? '✓ Validated' : '⏳ Pending Review'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Registration Date</p>
              <p className="font-medium text-gray-800">
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showMessageForm ? 'Cancel' : '+ New Message'}
            </button>
          </div>

          {/* New Message Form */}
          {showMessageForm && (
            <form onSubmit={handleSendMessage} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Message subject"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="content"
                    required
                    rows={4}
                    value={messageForm.content}
                    onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingMessage}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}

          {/* Messages List */}
          {messagesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg ${
                    message.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{message.subject}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/"
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
          >
            <p className="font-medium text-gray-800">🏠 Home</p>
          </Link>
          <Link
            href="/services"
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
          >
            <p className="font-medium text-gray-800">📋 Services</p>
          </Link>
          <Link
            href="/contact"
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
          >
            <p className="font-medium text-gray-800">📧 Contact</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
