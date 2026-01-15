import axios, { AxiosError, AxiosInstance } from 'axios';
import type { ApiError } from '@/types';
import { TIMEOUTS } from '@utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Create and configure axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor for logging and modification
 */
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    };

    if (error.response) {
      // Server responded with error status
      apiError.message = (error.response.data as { message?: string })?.message ||
        `Server error: ${error.response.status}`;
      apiError.code = `HTTP_${error.response.status}`;
      apiError.details = error.response.data;
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'Cannot connect to server. Please check if the backend is running.';
      apiError.code = 'NETWORK_ERROR';
    } else {
      // Error in request setup
      apiError.message = error.message || 'Failed to make request';
      apiError.code = 'REQUEST_ERROR';
    }

    console.error('❌ API Error:', apiError);
    return Promise.reject(apiError);
  }
);

export default apiClient;
