import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Response interceptor for comprehensive error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    let title = 'Error';

    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      const data = error.response.data;

      // Extract error message from various response formats
      if (data?.detail) {
        if (typeof data.detail === 'string') {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Validation errors from FastAPI
          message = data.detail.map((err: any) => 
            `${err.loc?.join(' → ') || 'Field'}: ${err.msg}`
          ).join(', ');
        }
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }

      // Set title based on status code
      switch (status) {
        case 400:
          title = 'Bad Request';
          break;
        case 401:
          title = 'Unauthorized';
          message = 'Please log in to continue';
          break;
        case 403:
          title = 'Forbidden';
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          title = 'Not Found';
          message = 'The requested resource was not found';
          break;
        case 409:
          title = 'Conflict';
          break;
        case 422:
          title = 'Validation Error';
          break;
        case 429:
          title = 'Too Many Requests';
          message = 'Please slow down and try again later';
          break;
        case 500:
          title = 'Server Error';
          message = 'An internal server error occurred. Please try again later.';
          break;
        case 503:
          title = 'Service Unavailable';
          message = 'The service is temporarily unavailable. Please try again later.';
          break;
        default:
          title = `Error ${status}`;
      }

      console.error(`API Error [${status}]:`, data);
    } else if (error.request) {
      // Request made but no response received
      title = 'Network Error';
      message = 'Unable to connect to the server. Please check your internet connection.';
      console.error('Network Error:', error.message);
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      title = 'Request Timeout';
      message = 'The request took too long. Please try again.';
      console.error('Timeout Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    // Show toast notification for user feedback
    // Don't show toast for certain operations handled by components
    if (!error.config?.skipErrorToast) {
      toast.error(message, {
        description: title !== 'Error' ? title : undefined,
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

// Request interceptor (for future auth tokens)
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here in the future
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
