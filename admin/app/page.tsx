'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/auth.store';
import { useLogout } from '@/src/hooks/useAuth';
import {
  useAllClients,
  usePendingClients,
  useValidatedClients,
} from '@/src/hooks/useClients';
import FormValidationModal from '@/src/components/FormValidationModal';

type TabType = 'pending-partner' | 'pending-residence' | 'pending-equivalence' | 'validated' | 'all-clients';

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const logout = useLogout();
  
  const [activeTab, setActiveTab] = useState<TabType>('pending-partner');
  const [currentPage, setCurrentPage] = useState(1);
  const [formModalState, setFormModalState] = useState<{
    isOpen: boolean;
    clientId: string;
    formType: 'equivalence' | 'residence' | 'partner';
  }>({
    isOpen: false,
    clientId: '',
    formType: 'equivalence',
  });

  const { data: allClientsData, isLoading: loadingAll } = useAllClients(currentPage);
  const { data: pendingClients, isLoading: loadingPending, refetch: refetchPending } = usePendingClients();
  const { data: validatedClients, isLoading: loadingValidated } = useValidatedClients();

  // Filter clients by form type
  const pendingPartnerClients = pendingClients?.filter(
    (client) => client.isSendingPartners && client.partnerStatus === 'pending'
  ) || [];
  
  const pendingResidenceClients = pendingClients?.filter(
    (client) => client.isSendingFormulaireResidence && client.residenceStatus === 'pending'
  ) || [];
  
  const pendingEquivalenceClients = pendingClients?.filter(
    (client) => client.isSendingFormulaireEquivalence && client.equivalenceStatus === 'pending'
  ) || [];

  // Check authentication and redirect if needed - ONLY after hydration
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleFormModalOpen = (
    clientId: string,
    formType: 'equivalence' | 'residence' | 'partner'
  ) => {
    setFormModalState({
      isOpen: true,
      clientId,
      formType,
    });
  };

  const handleFormModalClose = () => {
    setFormModalState({
      ...formModalState,
      isOpen: false,
    });
  };

  const handleFormValidationSuccess = () => {
    refetchPending();
  };

  const handleViewDetails = (type: 'client' | 'form' | 'partner', id: string) => {
    if (type === 'client') {
      // For clients, we can keep the modal or navigate to a detail page
      // For now, let's navigate to details page for consistency
      router.push(`/details?type=form&id=${id}`);
    } else if (type === 'form') {
      router.push(`/details?type=form&id=${id}`);
    } else if (type === 'partner') {
      router.push(`/details?type=partner&id=${id}`);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'all') {
      setCurrentPage(1);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalClients: allClientsData?.pagination.total || 0,
    pendingPartner: pendingPartnerClients.length,
    pendingResidence: pendingResidenceClients.length,
    pendingEquivalence: pendingEquivalenceClients.length,
    validatedClients: validatedClients?.length || 0,
  };

  const tabs = [
    { id: 'pending-partner' as TabType, label: '🤝 Pending Partner', count: stats.pendingPartner },
    { id: 'pending-residence' as TabType, label: '🏠 Pending Residence', count: stats.pendingResidence },
    { id: 'pending-equivalence' as TabType, label: '🎓 Pending Equivalence', count: stats.pendingEquivalence },
    { id: 'validated' as TabType, label: '✅ Recently Validated', count: stats.validatedClients },
    { id: 'all-clients' as TabType, label: '📋 All Clients', count: stats.totalClients },
  ];

  const renderTable = () => {
    // ========================================
    // TAB 1: PENDING PARTNER APPLICATIONS
    // ========================================
    if (activeTab === 'pending-partner') {
      if (loadingPending) {
        return <div className="text-center py-12 text-gray-500">Loading partner applications...</div>;
      }
      if (pendingPartnerClients.length === 0) {
        return <div className="text-center py-12 text-gray-500">No pending partner applications</div>;
      }
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Passport</th>
                <th className="px-4 py-3 text-left">Nationality</th>
                <th className="px-4 py-3 text-left">Submitted Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPartnerClients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium">{client.name}</td>
                  <td className="px-4 py-4">{client.email}</td>
                  <td className="px-4 py-4">{client.passportNumber || 'N/A'}</td>
                  <td className="px-4 py-4">{client.nationality || 'N/A'}</td>
                  <td className="px-4 py-4">{formatDate(client.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleFormModalOpen(client.id, 'partner')}
                      >
                        👁️ View Data
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleFormModalOpen(client.id, 'partner')}
                      >
                        ✓ Validate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ========================================
    // TAB 2: PENDING RESIDENCE APPLICATIONS
    // ========================================
    if (activeTab === 'pending-residence') {
      if (loadingPending) {
        return <div className="text-center py-12 text-gray-500">Loading residence applications...</div>;
      }
      if (pendingResidenceClients.length === 0) {
        return <div className="text-center py-12 text-gray-500">No pending residence applications</div>;
      }
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Passport</th>
                <th className="px-4 py-3 text-left">Nationality</th>
                <th className="px-4 py-3 text-left">Submitted Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingResidenceClients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium">{client.name}</td>
                  <td className="px-4 py-4">{client.email}</td>
                  <td className="px-4 py-4">{client.passportNumber || 'N/A'}</td>
                  <td className="px-4 py-4">{client.nationality || 'N/A'}</td>
                  <td className="px-4 py-4">{formatDate(client.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleFormModalOpen(client.id, 'residence')}
                      >
                        👁️ View Data
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleFormModalOpen(client.id, 'residence')}
                      >
                        ✓ Validate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ========================================
    // TAB 3: PENDING EQUIVALENCE APPLICATIONS
    // ========================================
    if (activeTab === 'pending-equivalence') {
      if (loadingPending) {
        return <div className="text-center py-12 text-gray-500">Loading equivalence applications...</div>;
      }
      if (pendingEquivalenceClients.length === 0) {
        return <div className="text-center py-12 text-gray-500">No pending equivalence applications</div>;
      }
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Passport</th>
                <th className="px-4 py-3 text-left">Nationality</th>
                <th className="px-4 py-3 text-left">Submitted Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingEquivalenceClients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium">{client.name}</td>
                  <td className="px-4 py-4">{client.email}</td>
                  <td className="px-4 py-4">{client.passportNumber || 'N/A'}</td>
                  <td className="px-4 py-4">{client.nationality || 'N/A'}</td>
                  <td className="px-4 py-4">{formatDate(client.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleFormModalOpen(client.id, 'equivalence')}
                      >
                        👁️ View Data
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleFormModalOpen(client.id, 'equivalence')}
                      >
                        ✓ Validate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ========================================
    // TAB 4: RECENTLY VALIDATED CLIENTS
    // ========================================
    if (activeTab === 'validated') {
      if (loadingValidated) {
        return <div className="text-center py-12 text-gray-500">Loading validated clients...</div>;
      }
      if (!validatedClients || validatedClients.length === 0) {
        return <div className="text-center py-12 text-gray-500">No validated clients yet</div>;
      }
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Validated Type</th>
                <th className="px-4 py-3 text-left">Validated At</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {validatedClients.map((client) => {
                // Determine which form type was validated
                const validatedTypes = [];
                if (client.equivalenceStatus === 'validated') validatedTypes.push('🎓 Equivalence');
                if (client.residenceStatus === 'validated') validatedTypes.push('🏠 Residence');
                if (client.partnerStatus === 'validated') validatedTypes.push('🤝 Partner');
                
                return (
                  <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium">{client.name}</td>
                    <td className="px-4 py-4">{client.email}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {validatedTypes.map((type, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatDate(client.updatedAt)}</td>
                    <td className="px-4 py-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleViewDetails('client', client.id)}
                      >
                        👁️ View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // ========================================
    // TAB 5: ALL CLIENTS
    // ========================================
    if (activeTab === 'all-clients') {
      if (loadingAll) {
        return <div className="text-center py-12 text-gray-500">Loading clients...</div>;
      }
      if (!allClientsData?.data || allClientsData.data.length === 0) {
        return <div className="text-center py-12 text-gray-500">No clients found</div>;
      }
      return (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-600 text-white">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Passport</th>
                  <th className="px-4 py-3 text-left">Nationality</th>
                  <th className="px-4 py-3 text-left">Registered Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allClientsData.data.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium">{client.name}</td>
                    <td className="px-4 py-4">{client.email}</td>
                    <td className="px-4 py-4">{client.passportNumber || 'N/A'}</td>
                    <td className="px-4 py-4">{client.nationality || 'N/A'}</td>
                    <td className="px-4 py-4">{formatDate(client.createdAt)}</td>
                    <td className="px-4 py-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                        onClick={() => handleViewDetails('client', client.id)}
                      >
                        👁️ View Data
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {allClientsData.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, allClientsData.pagination.total)} of {allClientsData.pagination.total} clients
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: allClientsData.pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 || 
                             page === allClientsData.pagination.totalPages || 
                             Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <div key={page} className="flex gap-1">
                          {showEllipsis && (
                            <span className="px-3 py-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-slate-600 text-white border-slate-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === allClientsData.pagination.totalPages}
                  className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      );
    }

    // Default fallback
    return <div className="text-center py-12 text-gray-500">Select a tab to view data</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-linear-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🍁 Canada Immigration Admin Dashboard</h1>
              <p className="text-purple-100">Manage client applications and validations</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm text-purple-100">Welcome back,</p>
                  <p className="font-semibold">{user.username}</p>
                </div>
              )}
              <Link
                href="/addadmin"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                + Add Admin
              </Link>
              <button
                onClick={logout}
                className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-green-600 text-sm font-semibold uppercase mb-2">🤝 Partner</h3>
            <div className="text-4xl font-bold text-gray-800">{stats.pendingPartner}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-indigo-600 text-sm font-semibold uppercase mb-2">🏠 Residence</h3>
            <div className="text-4xl font-bold text-gray-800">{stats.pendingResidence}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-purple-600 text-sm font-semibold uppercase mb-2">🎓 Equivalence</h3>
            <div className="text-4xl font-bold text-gray-800">{stats.pendingEquivalence}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-green-600 text-sm font-semibold uppercase mb-2">✅ Validated</h3>
            <div className="text-4xl font-bold text-gray-800">{stats.validatedClients}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-slate-600 text-sm font-semibold uppercase mb-2">📋 All Clients</h3>
            <div className="text-4xl font-bold text-gray-800">{stats.totalClients}</div>
          </div>
        </div>

        {/* Tabs and Table Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <div className="p-8">
            {renderTable()}
          </div>
        </div>
      </div>
      
      {/* Form Validation Modal */}
      <FormValidationModal
        isOpen={formModalState.isOpen}
        onClose={handleFormModalClose}
        clientId={formModalState.clientId}
        formType={formModalState.formType}
        onSuccess={handleFormValidationSuccess}
      />
    </div>
  );
}
