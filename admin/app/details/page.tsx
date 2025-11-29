'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormById } from '@/src/hooks/useForms';
import { usePartnerById } from '@/src/hooks/usePartners';
import { useClientById } from '@/src/hooks/useClients';
import Link from 'next/link';

function DetailsPageContent() {
  const searchParams = useSearchParams();
  
  const type = searchParams.get('type'); // 'form', 'partner', or 'client'
  const id = searchParams.get('id');
  
  const { data: formData, isLoading: formLoading } = useFormById(
    type === 'form' && id ? id : ''
  );
  const { data: partnerData, isLoading: partnerLoading } = usePartnerById(
    type === 'partner' && id ? id : ''
  );
  const { data: clientData, isLoading: clientLoading } = useClientById(
    type === 'client' && id ? id : ''
  );

  const isLoading = type === 'form' ? formLoading : type === 'partner' ? partnerLoading : clientLoading;
  const data = type === 'form' ? formData : type === 'partner' ? partnerData : clientData;

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

  const formatDate = (date: string | Date) => {
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
                  {/* <div>
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
                  </div> */}
                  <div>
                    <p className="text-sm text-gray-500">Email Verified</p>
                    <p className="font-semibold">
                      {formData.client.isEmailVerified ? (
                        <span className="text-green-600">✅ Verified</span>
                      ) : (
                        <span className="text-yellow-600">⏳ Not Verified</span>
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

        {type === 'client' && clientData && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Client Profile
              </h2>
              <p className="text-gray-600">Member since {formatDate(clientData.createdAt)}</p>
            </div>

            {/* Client Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 rounded-full p-2 mr-3">👤</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold text-gray-800">{clientData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{clientData.email}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500">Passport Number</p>
                  <p className="font-semibold text-gray-800">{clientData.passportNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-semibold text-gray-800">{clientData.nationality || 'N/A'}</p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-500">Email Verified</p>
                  <p className="font-semibold">
                    {clientData.isEmailVerified ? (
                      <span className="text-green-600">✅ Verified</span>
                    ) : (
                      <span className="text-yellow-600">⏳ Not Verified</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-semibold text-gray-800">{formatDate(clientData.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Form Submissions Status */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">📝</span>
                Form Submissions
              </h3>
              <div className="space-y-4">
                {/* Partner Status */}
                {clientData.isSendingPartners && (
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">🤝 Partner Application</p>
                        <p className="text-sm text-gray-600">Status: {clientData.partnerStatus || 'unknown'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        clientData.partnerStatus === 'validated' 
                          ? 'bg-green-100 text-green-800' 
                          : clientData.partnerStatus === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {clientData.partnerStatus === 'validated' ? '✅ Validated' : 
                         clientData.partnerStatus === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                      </span>
                    </div>
                    {clientData.partnerRejectionReason && (
                      <p className="text-sm text-red-600 mt-2">
                        Rejection Reason: {clientData.partnerRejectionReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Residence Status */}
                {clientData.isSendingFormulaireResidence && (
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">🏠 Residence Application</p>
                        <p className="text-sm text-gray-600">Status: {clientData.residenceStatus || 'unknown'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(clientData as any).folderResidence && (
                          <a
                            href={(() => {
                              const url = (clientData as any).folderResidence;
                              // If URL is relative (local file), prepend backend URL
                              if (url && url.startsWith('/uploads/')) {
                                return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
                              }
                              return url;
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            📁 View Folder
                          </a>
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          clientData.residenceStatus === 'validated' 
                            ? 'bg-green-100 text-green-800' 
                            : clientData.residenceStatus === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {clientData.residenceStatus === 'validated' ? '✅ Validated' : 
                           clientData.residenceStatus === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                    {clientData.residenceRejectionReason && (
                      <p className="text-sm text-red-600 mt-2">
                        Rejection Reason: {clientData.residenceRejectionReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Equivalence Status */}
                {clientData.isSendingFormulaireEquivalence && (
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">🎓 Equivalence Application</p>
                        <p className="text-sm text-gray-600">Status: {clientData.equivalenceStatus || 'unknown'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(clientData as any).folderEquivalence && (
                          <a
                            href={(() => {
                              const url = (clientData as any).folderEquivalence;
                              // If URL is relative (local file), prepend backend URL
                              if (url && url.startsWith('/uploads/')) {
                                return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
                              }
                              return url;
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            📁 View Folder
                          </a>
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          clientData.equivalenceStatus === 'validated' 
                            ? 'bg-green-100 text-green-800' 
                            : clientData.equivalenceStatus === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {clientData.equivalenceStatus === 'validated' ? '✅ Validated' : 
                           clientData.equivalenceStatus === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                    {clientData.equivalenceRejectionReason && (
                      <p className="text-sm text-red-600 mt-2">
                        Rejection Reason: {clientData.equivalenceRejectionReason}
                      </p>
                    )}
                  </div>
                )}

                {!clientData.isSendingPartners && 
                 !clientData.isSendingFormulaireResidence && 
                 !clientData.isSendingFormulaireEquivalence && (
                  <div className="text-center py-4 text-gray-500">
                    No form submissions yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    }>
      <DetailsPageContent />
    </Suspense>
  );
}
