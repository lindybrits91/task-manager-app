const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/*
 * Custom error class for API errors with HTTP status code
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/*
 * Handle API response and parse JSON or throw ApiError
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: 'Error parsing response body as JSON.' }));
    throw new ApiError(errorData.detail || `HTTP ${response.status}`, response.status);
  }

  if (response.status === 204) {
    // There is no content in the response body
    return undefined as T;
  }

  return response.json();
}

export { API_BASE_URL };
