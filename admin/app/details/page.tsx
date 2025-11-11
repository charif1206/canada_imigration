'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormById } from '@/src/hooks/useForms';
import { usePartnerById } from '@/src/hooks/usePartners';
import Link from 'next/link';

export default function DetailsPage() {
  const searchParams = useSearchParams();
  
  const type = searchParams.get('type'); // 'form' or 'partner'
  const id = searchParams.get('id');
  
  const { data: formData, isLoading: formLoading } = useFormById(
    type === 'form' && id ? id : ''
  );
  const { data: partnerData, isLoading: partnerLoading } = usePartnerById(
    type === 'partner' && id ? id : ''
  );

  const isLoading = type === 'form' ? formLoading : partnerLoading;
  const data = type === 'form' ? formData : partnerData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!data || !id || !type) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Data not found</h2>
          <Link 
            href="/"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-linear-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {type === 'form' ? '📋 Form Details' : '🤝 Partner Details'}
              </h1>
              <p className="text-purple-100">
                Viewing detailed information
              </p>
            </div>
            <Link
              href="/"
              className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {type === 'form' && formData && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {formData.type === 'EQUIVALENCE' ? 'Equivalence Form' : 'Residence Form'}
              </h2>
              <p className="text-gray-600">Submitted on {formatDate(formData.createdAt)}</p>
            </div>

            {/* Client Information */}
            {formData.client && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-100 text-purple-600 rounded-full p-2 mr-3">👤</span>
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{formData.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{formData.client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passport Number</p>
                    <p className="font-semibold text-gray-800">
                      {formData.client.passportNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="font-semibold text-gray-800">
                      {formData.client.nationality || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Validation Status</p>
                    <p className="font-semibold">
                      {formData.client.isValidated ? (
                        <span className="text-green-600">✅ Validated</span>
                      ) : (
                        <span className="text-yellow-600">⏳ Pending</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(formData.client.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Data */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">📝</span>
                Form Data
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                {formData.type === 'EQUIVALENCE' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.prenom)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.nom)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.email)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.telephone)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.adresse)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Postal Code</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.codePostal)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Education Level</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.niveau)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">University</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.universite)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bachelor Degree</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.titreLicence)}</p>
                    </div>
                    {String(formData.data.titreMaster) && (
                      <div>
                        <p className="text-sm text-gray-500">Master Degree</p>
                        <p className="font-semibold text-gray-800">{String(formData.data.titreMaster || '')}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Start Year</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.anneeDebut)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bachelor Graduation Year</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.anneeObtentionLicence)}</p>
                    </div>
                    {String(formData.data.anneeObtentionMaster) && (
                      <div>
                        <p className="text-sm text-gray-500">Master Graduation Year</p>
                        <p className="font-semibold text-gray-800">{String(formData.data.anneeObtentionMaster || '')}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.nomComplet)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.dateNaissance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country of Residence</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.paysResidence)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Program</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.programme)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Application Number</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.numeroDossier)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stage</p>
                      <p className="font-semibold text-gray-800">{String(formData.data.etape)}</p>
                    </div>
                  </div>
                )}

                {formData.fileUrl && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Attached File</p>
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL}${formData.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                    >
                      📎 View Attached File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {type === 'partner' && partnerData && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Partner Application
              </h2>
              <p className="text-gray-600">Submitted on {formatDate(partnerData.createdAt)}</p>
            </div>

            {/* Partner Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-100 text-green-600 rounded-full p-2 mr-3">🤝</span>
                Agency Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Agency Name</p>
                  <p className="font-semibold text-gray-800">{partnerData.data.agencyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manager Name</p>
                  <p className="font-semibold text-gray-800">{partnerData.data.managerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{partnerData.data.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone / WhatsApp</p>
                  <p className="font-semibold text-gray-800">{partnerData.data.phone}</p>
                </div>
                {partnerData.data.address && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-semibold text-gray-800">{partnerData.data.address}</p>
                  </div>
                )}
                {partnerData.data.city && (
                  <div>
                    <p className="text-sm text-gray-500">City / Wilaya</p>
                    <p className="font-semibold text-gray-800">{partnerData.data.city}</p>
                  </div>
                )}
                {partnerData.data.clientCount && (
                  <div>
                    <p className="text-sm text-gray-500">Monthly Client Count</p>
                    <p className="font-semibold text-gray-800">{partnerData.data.clientCount} clients</p>
                  </div>
                )}
              </div>

              {partnerData.data.message && (
                <div className="mt-6 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <p className="text-gray-800">{partnerData.data.message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
