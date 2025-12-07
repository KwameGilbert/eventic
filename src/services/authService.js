/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls including
 * login, registration, password reset, and user profile.
 */

import api, { TokenManager } from './api';

// User role constants (matching backend User model)
export const USER_ROLES = {
    ADMIN: 'admin',
    ORGANIZER: 'organizer',
    ATTENDEE: 'attendee',
    POS: 'pos',
    SCANNER: 'scanner',
};

const authService = {
    /**
     * Register a new attendee
     * Backend expects: name, email, password, role (optional)
     * 
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name (2-255 chars)
     * @param {string} userData.email - Email address
     * @param {string} userData.password - Password (min 8 chars)
     * @param {string} [userData.phone] - Phone number (optional)
     * @returns {Promise<Object>} Registration response with tokens
     */
    registerAttendee: async (userData) => {
        const payload = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: USER_ROLES.ATTENDEE,
        };

        // Add phone if provided
        if (userData.phone) {
            payload.phone = userData.phone;
        }

        const response = await api.post('/auth/register', payload);

        // Store tokens if registration returns them
        if (response.data?.access_token) {
            TokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }

        return response;
    },

    /**
     * Register a new organizer
     * Backend expects: name, email, password, role, organizerName (optional)
     * 
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name or organization name (2-255 chars)
     * @param {string} userData.email - Email address
     * @param {string} userData.password - Password (min 8 chars)
     * @param {string} [userData.phone] - Phone number (optional)
     * @param {string} [userData.organizerName] - Organization name (optional, defaults to name)
     * @returns {Promise<Object>} Registration response with tokens
     */
    registerOrganizer: async (userData) => {
        const payload = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: USER_ROLES.ORGANIZER,
        };

        // Add phone if provided
        if (userData.phone) {
            payload.phone = userData.phone;
        }

        // Add organization name if provided (for creating Organizer profile)
        if (userData.organizerName) {
            payload.organizerName = userData.organizerName;
        }

        const response = await api.post('/auth/register', payload);

        // Store tokens if registration returns them
        if (response.data?.access_token) {
            TokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }

        return response;
    },

    /**
     * Register a new user (generic)
     * Backend expects: name, email, password, role (optional - defaults to attendee)
     * 
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name (2-255 chars)
     * @param {string} userData.email - Email address
     * @param {string} userData.password - Password (min 8 chars)
     * @param {string} [userData.role] - User role (defaults to 'attendee')
     * @param {string} [userData.phone] - Phone number (optional)
     * @returns {Promise<Object>} Registration response with tokens
     */
    register: async (userData) => {
        const payload = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role || USER_ROLES.ATTENDEE,
        };

        // Add phone if provided
        if (userData.phone) {
            payload.phone = userData.phone;
        }

        const response = await api.post('/auth/register', payload);

        // Store tokens if registration returns them
        if (response.data?.access_token) {
            TokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }

        return response;
    },

    /**
     * Login user with email and password
     * Backend determines the user's role and returns it in the response
     * 
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Login response with tokens and user data (including role)
     */
    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password,
        });

        // Debug: Log the full response to see structure
        console.log('Login response:', response);
        console.log('typeof response:', typeof response);
        console.log('response.data:', response.data);
        console.log('response.access_token:', response.access_token);

        // The API interceptor returns response.data directly from axios
        // So the structure is: { success, message, data: { user, access_token, ... } }
        // Access the nested data object
        const authData = response.data || response;

        console.log('authData:', authData);

        // Store tokens if login successful
        if (authData?.access_token) {
            console.log('Storing tokens...');
            TokenManager.setTokens(
                authData.access_token,
                authData.refresh_token
            );
            // Store user data (includes role from backend)
            if (authData.user) {
                console.log('Storing user:', authData.user);
                localStorage.setItem('user', JSON.stringify(authData.user));
            }
        } else {
            console.log('No access_token found. Checking all keys:', Object.keys(response));
        }

        return response;
    },

    /**
     * Logout user
     * @returns {Promise<Object>} Logout response
     */
    logout: async () => {
        try {
            const refreshToken = TokenManager.getRefreshToken();
            await api.post('/auth/logout', {
                refresh_token: refreshToken,
            });
        } finally {
            // Always clear tokens, even if API call fails
            TokenManager.clearTokens();
        }
    },

    /**
     * Get current user profile
     * @returns {Promise<Object>} User profile data
     */
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response;
    },

    /**
     * Refresh access token
     * @returns {Promise<Object>} New tokens
     */
    refreshToken: async () => {
        const refreshToken = TokenManager.getRefreshToken();
        const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
        });

        if (response.data?.access_token) {
            TokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
        }

        return response;
    },

    /**
     * Request password reset (send OTP to email)
     * @param {string} email - User email
     * @returns {Promise<Object>} Password reset request response
     */
    requestPasswordReset: async (email) => {
        const response = await api.post('/auth/password/forgot', {
            email,
        });
        return response;
    },

    /**
     * Reset password using OTP
     * @param {string} email - User email
     * @param {string} otp - One-time password from email
     * @param {string} password - New password
     * @param {string} passwordConfirmation - Password confirmation
     * @returns {Promise<Object>} Password reset response
     */
    resetPassword: async (email, otp, password, passwordConfirmation) => {
        const response = await api.post('/auth/password/reset', {
            email,
            otp,
            password,
            password_confirmation: passwordConfirmation,
        });
        return response;
    },

    /**
     * Change password for authenticated user
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @param {boolean} [logoutOtherDevices=false] - Whether to logout from other devices
     * @returns {Promise<Object>} Password change response
     */
    changePassword: async (currentPassword, newPassword, logoutOtherDevices = false) => {
        const response = await api.post('/auth/password/change', {
            current_password: currentPassword,
            new_password: newPassword,
            logout_other_devices: logoutOtherDevices,
        });
        return response;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} Whether user has valid access token
     */
    isAuthenticated: () => {
        const token = TokenManager.getAccessToken();
        return token && !TokenManager.isTokenExpired(token);
    },

    /**
     * Get stored user from localStorage
     * @returns {Object|null} Stored user data or null
     */
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Check if current user has a specific role
     * @param {string} role - Role to check
     * @returns {boolean} Whether user has the role
     */
    hasRole: (role) => {
        const user = authService.getStoredUser();
        return user?.role === role;
    },

    /**
     * Check if current user is an organizer
     * @returns {boolean}
     */
    isOrganizer: () => authService.hasRole(USER_ROLES.ORGANIZER),

    /**
     * Check if current user is an attendee
     * @returns {boolean}
     */
    isAttendee: () => authService.hasRole(USER_ROLES.ATTENDEE),

    /**
     * Check if current user is an admin
     * @returns {boolean}
     */
    isAdmin: () => authService.hasRole(USER_ROLES.ADMIN),
};

export default authService;
