import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import authService, { USER_ROLES } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from stored data
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check if we have stored user data and valid token
                const storedUser = authService.getStoredUser();

                if (storedUser && authService.isAuthenticated()) {
                    // User is already logged in from previous session
                    setUser(storedUser);

                    // Optionally verify with server (silently in background)
                    try {
                        const response = await authService.getCurrentUser();
                        // Backend /auth/me returns user data directly in response.data
                        if (response.data) {
                            const freshUser = response.data;
                            setUser(freshUser);
                            localStorage.setItem('user', JSON.stringify(freshUser));
                        }
                    } catch {
                        // If server check fails, keep using stored data
                        // Token might still be valid
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Login user with email and password
     * Backend returns the user's role automatically
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} User data with role
     */
    const login = useCallback(async (email, password) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.login(email, password);
            // Response structure: { success, message, data: { user, access_token, ... } }
            const userData = response.data?.user;
            if (userData) {
                setUser(userData);
            }
            return userData;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Register a new attendee and auto-login
     * @param {Object} userData - { name, email, password, phone? }
     * @returns {Promise<Object>} Registration response with user
     */
    const registerAttendee = useCallback(async (userData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.registerAttendee(userData);
            // Response structure: { success, message, data: { user, access_token, refresh_token, ... } }
            // authService already stores tokens, we just need to set user state
            const registeredUser = response.data?.user;
            if (registeredUser) {
                setUser(registeredUser);
            }
            return response;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Register a new organizer and auto-login
     * @param {Object} userData - { name, email, password, phone? }
     * @returns {Promise<Object>} Registration response with user
     */
    const registerOrganizer = useCallback(async (userData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.registerOrganizer(userData);
            // Response structure: { success, message, data: { user, access_token, refresh_token, ... } }
            // authService already stores tokens, we just need to set user state
            const registeredUser = response.data?.user;
            if (registeredUser) {
                setUser(registeredUser);
            }
            return response;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Generic register (specify role in userData) and auto-login
     * @param {Object} userData - { name, email, password, role?, phone? }
     * @returns {Promise<Object>} Registration response with user
     */
    const register = useCallback(async (userData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.register(userData);
            // Response structure: { success, message, data: { user, access_token, refresh_token, ... } }
            // authService already stores tokens, we just need to set user state
            const registeredUser = response.data?.user;
            if (registeredUser) {
                setUser(registeredUser);
            }
            return response;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Logout current user
     */
    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.logout();
        } catch (err) {
            // Even if logout API fails, clear local state
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    }, []);

    /**
     * Request password reset (sends OTP to email)
     * @param {string} email 
     * @returns {Promise<Object>}
     */
    const requestPasswordReset = useCallback(async (email) => {
        setError(null);
        try {
            const response = await authService.requestPasswordReset(email);
            return response;
        } catch (err) {
            setError(err.message || 'Password reset request failed');
            throw err;
        }
    }, []);

    /**
     * Reset password using OTP
     * @param {string} email 
     * @param {string} otp 
     * @param {string} password 
     * @param {string} passwordConfirmation 
     * @returns {Promise<Object>}
     */
    const resetPassword = useCallback(async (email, otp, password, passwordConfirmation) => {
        setError(null);
        try {
            const response = await authService.resetPassword(email, otp, password, passwordConfirmation);
            return response;
        } catch (err) {
            setError(err.message || 'Password reset failed');
            throw err;
        }
    }, []);

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    const isAuthenticated = useCallback(() => {
        return !!user && authService.isAuthenticated();
    }, [user]);

    /**
     * Check if current user is an organizer
     * @returns {boolean}
     */
    const isOrganizer = useCallback(() => {
        return user?.role === USER_ROLES.ORGANIZER;
    }, [user]);

    /**
     * Check if current user is an attendee
     * @returns {boolean}
     */
    const isAttendee = useCallback(() => {
        return user?.role === USER_ROLES.ATTENDEE;
    }, [user]);

    /**
     * Check if current user is an admin
     * @returns {boolean}
     */
    const isAdmin = useCallback(() => {
        return user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN;
    }, [user]);

    /**
     * Check if current user is a super admin
     * @returns {boolean}
     */
    const isSuperAdmin = useCallback(() => {
        return user?.role === USER_ROLES.SUPER_ADMIN;
    }, [user]);

    /**
     * Refresh current user data from server
     */
    const refreshUser = useCallback(async () => {
        try {
            const response = await authService.getCurrentUser();
            // Backend /auth/me returns user data in response.data
            const userData = response.data;
            if (userData) {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
            return userData;
        } catch (err) {
            console.error('Failed to refresh user:', err);
            throw err;
        }
    }, []);

    /**
     * Clear any auth errors
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        // State
        user,
        isLoading,
        error,

        // Auth methods
        login,
        register,
        registerAttendee,
        registerOrganizer,
        logout,

        // Auth checks
        isAuthenticated,
        isOrganizer,
        isAttendee,
        isAdmin,
        isSuperAdmin,

        // Password reset
        requestPasswordReset,
        resetPassword,

        // Utilities
        refreshUser,
        clearError,

        // Constants
        USER_ROLES,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
