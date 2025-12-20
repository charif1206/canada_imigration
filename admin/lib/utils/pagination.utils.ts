/**
 * Pagination Utilities
 */

/**
 * Calculate pagination display range
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number
): number[] {
  return Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
    // Show first page, last page, current page, and pages around current
    return (
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
    );
  });
}

/**
 * Check if ellipsis should be shown between pages
 */
export function shouldShowEllipsis(currentPage: number, prevPage?: number): boolean {
  if (!prevPage) return false;
  return currentPage - prevPage > 1;
}

/**
 * Calculate pagination info text
 */
export function getPaginationInfo(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): string {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  return `Showing ${start} to ${end} of ${totalItems} clients`;
}
