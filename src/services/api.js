/**
 * API Configuration
 * 
 * Base axios instance with interceptors for authentication,
 * error handling, and request/response transformation.
 */

import axios from 'axios';

// Base API URL - update this based on your environment
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Token management utilities
const TokenManager = {
    getAccessToken: () => localStorage.getItem('accessToken'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },
    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
    isTokenExpired: (token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
};

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - Attach auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = TokenManager.getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh and errors
api.interceptors.response.use(
    (response) => {
        // Ensure data is parsed as JSON
        let data = response.data;

        // If data is a string, try to parse it as JSON
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.warn('Response is not valid JSON:', e);
            }
        }

        return data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = TokenManager.getRefreshToken();

            if (refreshToken && !TokenManager.isTokenExpired(refreshToken)) {
                try {
                    // Attempt to refresh the token
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken
                    });

                    const { access_token, refresh_token } = response.data.data;
                    TokenManager.setTokens(access_token, refresh_token);

                    processQueue(null, access_token);

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    TokenManager.clearTokens();

                    // Redirect to login page
                    window.location.href = '/signin';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // No refresh token or it's expired
                TokenManager.clearTokens();
                window.location.href = '/signin';
                return Promise.reject(error);
            }
        }

        // Handle other errors
        const errorResponse = {
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            errors: error.response?.data?.errors || null,
            code: error.response?.data?.code || null,
        };

        return Promise.reject(errorResponse);
    }
);

// Export the configured axios instance and utilities
export { api, TokenManager, API_BASE_URL };
export default api;
