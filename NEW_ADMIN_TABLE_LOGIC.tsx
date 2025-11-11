// NEW TABLE RENDERING LOGIC - COPY THIS TO page.tsx

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
                    return page === 1 || 
                           page === allClientsData.pagination.totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
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
