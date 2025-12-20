/**
 * Dashboard State Hook
 * Manages tab state, pagination, and modal state
 */

import { useState } from 'react';
import { TabType, FormType, PAGINATION_CONFIG } from '@/lib/constants/dashboard.constants';

interface FormModalState {
  isOpen: boolean;
  clientId: string;
  formType: FormType;
}

export function useDashboardState() {
  const [activeTab, setActiveTab] = useState<TabType>('pending-partner');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [formModalState, setFormModalState] = useState<FormModalState>({
    isOpen: false,
    clientId: '',
    formType: 'equivalence',
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'all-clients') {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFormModalOpen = (clientId: string, formType: FormType) => {
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

  return {
    activeTab,
    currentPage,
    formModalState,
    handleTabChange,
    handlePageChange,
    handleFormModalOpen,
    handleFormModalClose,
  };
}
