import { PaginationOptions, PaginationMetadata } from '../interfaces/blog.interface';
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../constants/blog.constants';

/**
 * Parse and validate pagination parameters
 */
export function parsePaginationOptions(
  page?: string,
  limit?: string,
): PaginationOptions {
  const parsedPage = page ? parseInt(page, 10) : DEFAULT_PAGE;
  const parsedLimit = limit ? parseInt(limit, 10) : DEFAULT_LIMIT;

  // Ensure page is at least 1
  const safePage = Math.max(1, parsedPage);
  
  // Ensure limit is within bounds
  const safeLimit = Math.min(Math.max(1, parsedLimit), MAX_LIMIT);
  
  // Calculate skip for database query
  const skip = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    skip,
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMetadata(
  total: number,
  page: number,
  limit: number,
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit);

  return {
    currentPage: page,
    totalPages,
    totalCount: total,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
