import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
                // First check if we have stored user data
                const storedUser = authService.getStoredUser();

                if (storedUser && authService.isAuthenticated()) {
                    // Optionally verify with server
                    try {
                        const response = await authService.getCurrentUser();
                        setUser(response.data || storedUser);
                    } catch {
                        // If server check fails, use stored data
                        setUser(storedUser);
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
            const userData = response.data?.user;
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Register a new attendee
     * @param {Object} userData - { name, email, password }
     * @returns {Promise<Object>} Registration response
     */
    const registerAttendee = useCallback(async (userData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.registerAttendee(userData);
            // Auto-login after registration if tokens are returned
            if (response.data?.user) {
                setUser(response.data.user);
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
     * Register a new organizer
     * @param {Object} userData - { name, email, password, organizerName }
     * @returns {Promise<Object>} Registration response
     */
    const registerOrganizer = useCallback(async (userData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.registerOrganizer(userData);
            // Auto-login after registration if tokens are returned
            if (response.data?.user) {
                setUser(response.data.user);
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
     * Generic register (specify role in userData)
     * @param {Object} userData - { name, email, password, role }
     * @returns {Promise<Object>} Registration response
     */
    const register = useCallback(async (userData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.register(userData);
            // Auto-login after registration if tokens are returned
            if (response.data?.user) {
                setUser(response.data.user);
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
        return user?.role === USER_ROLES.ADMIN;
    }, [user]);

    /**
     * Refresh current user data from server
     */
    const refreshUser = useCallback(async () => {
        try {
            const response = await authService.getCurrentUser();
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

export default AuthContext;
