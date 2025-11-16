/**
 * API client utilities
 */

// In production, use relative URLs (proxied via Cloudflare Pages _redirects)
// In development, connect directly to local worker
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export interface ApiError {
  error: string;
  status?: number;
}

/**
 * Make API request with error handling
 */
export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  // Use relative URL if API_BASE_URL is empty (production)
  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include", // Include cookies for Better Auth
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      }));
      throw error;
    }

    return response.json();
  } catch (error) {
    // Handle network errors (DNS failure, timeout, etc.)
    if (error instanceof TypeError) {
      throw {
        error: "Network error: Unable to connect to server",
        status: 0,
      } as ApiError;
    }
    throw error;
  }
};

/**
 * GET request
 */
export const apiGet = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "GET" });
};

/**
 * POST request
 */
export const apiPost = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request
 */
export const apiPut = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PATCH request
 */
export const apiPatch = <T>(endpoint: string, data?: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request
 */
export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "DELETE" });
};

