import axios, { AxiosResponse, AxiosError } from 'axios';
import { Platform } from 'react-native';
import { navigationRef } from '../navigation/RootNavigation';
import { sleep } from '../helpers';
import AuthService from './AuthService';
import Config from 'react-native-config';


// const API_URL = Config.API_URL;
interface RetryConfig {
  retries?: number;
  retryDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

const isAuthRoute = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.includes('/public/api/v1/auth/signin') ||
    url.includes('/public/api/v1/auth/refresh') ||
    url.includes('/public/api/v1/auth/revoke')
  );
};

const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && (
    error.code === 'ERR_NETWORK' ||
    error.code === 'NETWORK_ERROR' ||
    error.code === 'ECONNRESET' ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'EAI_AGAIN' ||
    error.message.includes('Network Error') ||
    error.message.includes('timeout')
  );
};

const retryWithJitter = async (
  config: any,
  retryCount: number,
  maxRetries: number,
  baseDelay: number
): Promise<void> => {
  if (retryCount >= maxRetries) {
    throw new Error(`Max retries (${maxRetries}) exceeded`);
  }
  
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const jitter = Math.random() * 1000;
  const delay = Math.min(exponentialDelay + jitter, 10000);
  
  await sleep(delay);
};
// API configuration
// fallback은 optional
const API_URL = Config.API_URL || 'http://192.168.0.18:8080';
export const imgServer = Config.IMAGE_SERVER_URL || 'https://www.plainknot.com';


export interface ServiceResponse<T> extends AxiosResponse<T> {
  payload: T;
  success: boolean;
}

// Create axios instances with default config
export const apiClient = axios.create({
  baseURL: API_URL,  
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000, // 20 seconds
  
  
  
});

// Create separate axios instance for multipart/form-data uploads
export const uploadApiClient = axios.create({
  baseURL: API_URL,  
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  timeout: 30000, // 30 seconds for uploads
});

export const authApiClient = axios.create({
  baseURL: API_URL + '/auth',  
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 seconds
});

export const barcodeMiningApiClient = axios.create({
  baseURL: API_URL + '/barcodeMining',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 seconds
});

// Create a function to add auth error handling to any axios instance
export const addAuthErrorHandling = (axiosInstance: any, retryConfig: RetryConfig = {}) => {
  const maxRetries = retryConfig.retries ?? 3;
  const baseDelay = retryConfig.retryDelay ?? 1000;
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config: any) => {
      config._retryCount = config._retryCount || 0;

      if (isAuthRoute(config?.url)) {
        return config;
      }

      try {
        const refreshToken = await AuthService.getRefreshToken();

        if (!refreshToken) {
          return config;
        }

        const isExpired = await AuthService.isRefreshTokenExpired();
        if (isExpired) {
          const newToken = await handleAuthError();
          if (newToken) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${newToken}`;
          }
        }
      } catch (error) {
        console.error('Request auth bootstrap failed:', error);
      }

      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
  // Response interceptor with auth error handling and retry logic
  axiosInstance.interceptors.response.use(
    (response: any) => {
      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as any;

      // Handle 401 Unauthorized errors first
      if (error.response && error.response.status === 401) {

        if (isAuthRoute(config?.url)) {
          return Promise.reject(error);
        }

        // Prevent infinite retry loop
        if (config._isRetryAfterRefresh) {
          return Promise.reject(error);
        }

        const newToken = await handleAuthError();

        if (newToken) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${newToken}`;
          config._isRetryAfterRefresh = true;

          return axiosInstance.request(config);
        }

        return Promise.reject(error);
      }

      // Handle network errors with retry logic
      if (isNetworkError(error) && config && config._retryCount < maxRetries) {
        try {
          await retryWithJitter(config, config._retryCount, maxRetries, baseDelay);
          config._retryCount += 1;
          return axiosInstance.request(config);
        } catch (retryError) {
          console.error('Max retries exceeded for network error');
          return Promise.reject(error);
        }
      }

      // Handle other network errors without response
      if (!error.response) {
        console.error('Network error or server not reachable');
      }

      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};

// Apply auth error handling to all API clients with specific retry configurations
addAuthErrorHandling(apiClient, { retries: 3, retryDelay: 1000 });
addAuthErrorHandling(uploadApiClient, { retries: 2, retryDelay: 2000 }); // Less retries for uploads, longer delay
addAuthErrorHandling(authApiClient, { retries: 3, retryDelay: 1000 });
addAuthErrorHandling(barcodeMiningApiClient, { retries: 3, retryDelay: 1000 });

// Global auth error handler
let isAuthErrorBeingHandled = false;
let isRefreshingToken = false;
let refreshTokenPromise: Promise<string | null> | null = null;

// Function to handle auth errors (401) with token refresh
const handleAuthError = async (): Promise<string | null> => {
  if (isRefreshingToken && refreshTokenPromise) {
    // If a refresh is already in progress, wait for it
    return refreshTokenPromise;
  }

  if (isAuthErrorBeingHandled) {
    return null;
  }

  try {
    isRefreshingToken = true;

    // Import auth service dynamically to avoid circular dependency
    const { default: AuthService } = await import('./AuthService');

    // Try to refresh the token first
    refreshTokenPromise = AuthService.refreshToken();
    const newToken = await refreshTokenPromise;

    if (newToken) {
      return newToken;
    }

    // If refresh failed, sign out the user once
    isAuthErrorBeingHandled = true;
    await AuthService.signOut();

    // Show alert or notification to user
    import('react-native').then(({ Alert }) => {
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please sign in again.',
        [{ text: 'OK' }]
      );
    });

    // Reset navigation stack to login screen
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Home' }], // This will show login when no user is authenticated
    });

    return null;
  } catch (error) {
    console.error('Error handling auth error:', error);
    return null;
  } finally {
    // Reset flags after a delay
    setTimeout(() => {
      isAuthErrorBeingHandled = false;
      isRefreshingToken = false;
      refreshTokenPromise = null;
    }, 1000);
  }
};

// Header management functions
export const setHeader = (token: string) => {
  const allInstances = [apiClient, uploadApiClient, authApiClient, barcodeMiningApiClient];

  if (!token) {
    allInstances.forEach(instance => {
      delete instance.defaults.headers.common['Authorization'];
    });
    return;
  }

  allInstances.forEach(instance => {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  });
}

export const removeHeader = () => {
  // Remove token from all API clients
  const allInstances = [apiClient, uploadApiClient, authApiClient, barcodeMiningApiClient];
  allInstances.forEach(instance => {
    delete instance.defaults.headers.common['Authorization'];
  });
}