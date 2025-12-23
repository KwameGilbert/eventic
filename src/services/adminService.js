/**
 * Admin Service
 * 
 * Handles all admin-related API calls
 * Including dashboard data, user management, and approvals
 */

import api from './api';

const adminService = {
    /**
     * Get admin dashboard data
     * @returns {Promise<Object>} Dashboard data
     */
    getDashboard: async () => {
        const response = await api.get('/admin/dashboard');
        return response;
    },

    /**
     * Get all users with optional filters
     * @param {Object} params - Query parameters
     * @param {string} [params.role] - Filter by role (admin, organizer, attendee)
     * @param {string} [params.search] - Search by name or email
     * @returns {Promise<Object>} Users data
     */
    getUsers: async (params = {}) => {
        const response = await api.get('/admin/users', { params });
        return response;
    },

    /**
     * Approve pending event
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Approval response
     */
    approveEvent: async (eventId) => {
        const response = await api.put(`/admin/events/${eventId}/approve`);
        return response;
    },

    /**
     * Reject pending event
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Rejection response
     */
    rejectEvent: async (eventId) => {
        const response = await api.put(`/admin/events/${eventId}/reject`);
        return response;
    },

    /**
     * Approve pending award
     * @param {number} awardId - Award ID
     * @returns {Promise<Object>} Approval response
     */
    approveAward: async (awardId) => {
        const response = await api.put(`/admin/awards/${awardId}/approve`);
        return response;
    },

    /**
     * Reject pending award
     * @param {number} awardId - Award ID
     * @returns {Promise<Object>} Rejection response
     */
    rejectAward: async (awardId) => {
        const response = await api.put(`/admin/awards/${awardId}/reject`);
        return response;
    },

    /**
     * Get single user details
     * @param {number} userId - User ID
     * @returns {Promise<Object>} User details
     */
    getUser: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response;
    },

    /**
     * Update user status
     * @param {number} userId - User ID
     * @param {string} status - New status (active, inactive, suspended)
     * @returns {Promise<Object>} Update response
     */
    updateUserStatus: async (userId, status) => {
        const response = await api.put(`/admin/users/${userId}/status`, { status });
        return response;
    },

    /**
     * Reset user password
     * @param {number} userId - User ID
     * @param {string} password - New password
     * @returns {Promise<Object>} Reset response
     */
    resetUserPassword: async (userId, password) => {
        const response = await api.post(`/admin/users/${userId}/reset-password`, { password });
        return response;
    },

    /**
     * Update user role
     * @param {number} userId - User ID
     * @param {string} role - New role (admin, organizer, attendee, pos, scanner)
     * @returns {Promise<Object>} Update response
     */
    updateUserRole: async (userId, role) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response;
    },

    /**
     * Delete user
     * @param {number} userId - User ID
     * @returns {Promise<Object>} Deletion response
     */
    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response;
    },

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (default: GHS)
     * @returns {string} Formatted currency string
     */
    formatCurrency: (amount, currency = 'GHS') => {
        if (currency === 'GHS') {
            return `GH₵${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
};

export default adminService;
