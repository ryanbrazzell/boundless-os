/**
 * Pagination utilities
 */

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}

/**
 * Parse pagination parameters from query string
 */
export const parsePagination = (query: Record<string, string | undefined>): PaginationParams => {
  const limit = query.limit ? parseInt(query.limit, 10) : undefined;
  const offset = query.offset ? parseInt(query.offset, 10) : undefined;
  const page = query.page ? parseInt(query.page, 10) : undefined;
  const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : undefined;

  return { limit, offset, page, pageSize };
};

/**
 * Normalize pagination to limit/offset
 */
export const normalizePagination = (
  params: PaginationParams,
  defaultLimit: number = 30,
  maxLimit: number = 1000
): { limit: number; offset: number } => {
  let limit = defaultLimit;
  let offset = 0;

  // Handle page-based pagination
  if (params.page !== undefined && params.pageSize !== undefined) {
    limit = Math.min(params.pageSize, maxLimit);
    offset = (params.page - 1) * limit;
  } else {
    // Handle limit/offset pagination
    if (params.limit !== undefined) {
      limit = Math.min(params.limit, maxLimit);
    }
    if (params.offset !== undefined) {
      offset = Math.max(0, params.offset);
    }
  }

  return { limit, offset };
};

/**
 * Create pagination result
 */
export const createPaginationResult = <T>(
  data: T[],
  pagination: { limit: number; offset: number; total?: number }
): PaginationResult<T> => {
  return {
    data,
    pagination: {
      ...pagination,
      hasMore: pagination.total
        ? pagination.offset + data.length < pagination.total
        : data.length === pagination.limit,
    },
  };
};

