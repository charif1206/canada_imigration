'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FormValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  formType: 'equivalence' | 'residence' | 'partner';
  onSuccess: () => void;
}

interface FormData {
  client: {
    id: string;
    name: string;
    email: string;
    passportNumber?: string;
    nationality?: string;
  };
  status: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  submission: any;
}

export default function FormValidationModal({
  isOpen,
  onClose,
  clientId,
  formType,
  onSuccess,
}: FormValidationModalProps) {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (isOpen && clientId) {
      fetchFormData();
    }
  }, [isOpen, clientId, formType]);

  const fetchFormData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/clients/${clientId}/forms/${formType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch form data');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/clients/${clientId}/forms/${formType}/validate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`✅ ${getFormTitle()} validated successfully!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to validate form');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/clients/${clientId}/forms/${formType}/reject`,
        { reason: rejectionReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`❌ ${getFormTitle()} rejected`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject form');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFormTitle = () => {
    switch (formType) {
      case 'equivalence':
        return 'Equivalence Form';
      case 'residence':
        return 'Residence Form';
      case 'partner':
        return 'Partner Application';
      default:
        return 'Form';
    }
  };

  const renderFormData = () => {
    if (!formData?.submission) {
      return <p className="text-gray-500">No submission data available</p>;
    }

    const data = formData.submission;

    if (formType === 'equivalence') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="font-semibold text-gray-800">{data.prenom || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-semibold text-gray-800">{data.nom || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">{data.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-gray-800">{data.telephone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold text-gray-800">{data.adresse || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Postal Code</p>
            <p className="font-semibold text-gray-800">{data.codePostal || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Education Level</p>
            <p className="font-semibold text-gray-800">{data.niveau || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">University</p>
            <p className="font-semibold text-gray-800">{data.universite || 'N/A'}</p>
          </div>
        </div>
      );
    }

    if (formType === 'residence') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold text-gray-800">{data.nomComplet || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-semibold text-gray-800">{data.dateNaissance || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="font-semibold text-gray-800">{data.paysResidence || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Program</p>
            <p className="font-semibold text-gray-800">{data.programme || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Application Number</p>
            <p className="font-semibold text-gray-800">{data.numeroDossier || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Stage</p>
            <p className="font-semibold text-gray-800">{data.etape || 'N/A'}</p>
          </div>
        </div>
      );
    }

    if (formType === 'partner') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold text-gray-800">{data.fullName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">{data.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-gray-800">{data.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Company</p>
            <p className="font-semibold text-gray-800">{data.company || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Message</p>
            <p className="font-semibold text-gray-800">{data.message || 'N/A'}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {formType === 'equivalence' && '🎓 '}
              {formType === 'residence' && '🧩 '}
              {formType === 'partner' && '🤝 '}
              {getFormTitle()}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              disabled={isProcessing}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading form data...</p>
            </div>
          ) : formData ? (
            <>
              {/* Client Information */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{formData.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{formData.client.email}</p>
                  </div>
                  {formData.client.passportNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Passport</p>
                      <p className="font-semibold text-gray-800">{formData.client.passportNumber}</p>
                    </div>
                  )}
                  {formData.client.nationality && (
                    <div>
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p className="font-semibold text-gray-800">{formData.client.nationality}</p>
                    </div>
                  )}
                </div>

                {/* Current Status */}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="font-semibold">
                    {formData.status === 'pending' && <span className="text-yellow-600">⏳ Pending</span>}
                    {formData.status === 'validated' && <span className="text-green-600">✅ Validated</span>}
                    {formData.status === 'rejected' && <span className="text-red-600">❌ Rejected</span>}
                  </p>
                  {formData.rejectionReason && (
                    <div className="mt-2">
                      <p className="text-sm text-red-500">Rejection Reason: {formData.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Submission Data */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Submission Data</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  {renderFormData()}
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div className="mb-6">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (optional)
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason if rejecting..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isProcessing}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-300"
                  disabled={isProcessing}
                >
                  {isProcessing ? '⏳ Rejecting...' : '❌ Reject'}
                </button>
                <button
                  onClick={handleValidate}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-green-300"
                  disabled={isProcessing}
                >
                  {isProcessing ? '⏳ Validating...' : '✅ Validate'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No form data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
