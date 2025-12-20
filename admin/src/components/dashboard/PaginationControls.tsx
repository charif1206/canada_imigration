/**
 * Pagination Controls Component
 * Handles pagination display and navigation
 */

import { getPaginationRange, shouldShowEllipsis, getPaginationInfo } from '@/lib/utils/pagination.utils';
import { PAGINATION_CONFIG } from '@/lib/constants/dashboard.constants';

interface PaginationData {
  total: number;
  totalPages: number;
}

interface PaginationControlsProps {
  currentPage: number;
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  paginationData,
  onPageChange,
}: PaginationControlsProps) {
  if (paginationData.totalPages <= 1) {
    return null;
  }

  const pageRange = getPaginationRange(currentPage, paginationData.totalPages);
  const paginationInfo = getPaginationInfo(
    currentPage,
    PAGINATION_CONFIG.ITEMS_PER_PAGE,
    paginationData.total
  );

  return (
    <div className="flex items-center justify-between text-black mt-6 pt-6 border-t">
      <div className="text-sm text-gray-600">{paginationInfo}</div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {pageRange.map((page, index, array) => {
            const prevPage = array[index - 1];
            const showEllipsis = shouldShowEllipsis(page, prevPage);

            return (
              <div key={page} className="flex gap-1">
                {showEllipsis && <span className="px-3 py-2 text-gray-500">...</span>}
                <button
                  onClick={() => onPageChange(page)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === paginationData.totalPages}
          className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}
