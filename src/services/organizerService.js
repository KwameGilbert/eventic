/**
 * Organizer Service
 * 
 * Handles all organizer-related API calls including
 * CRUD operations and search functionality.
 */

import api from './api';

const organizerService = {
    /**
     * Get all organizers
     * @param {Object} params - Query parameters
     * @param {number} [params.page] - Page number for pagination
     * @param {number} [params.per_page] - Items per page
     * @returns {Promise<Object>} List of organizers
     */
    getAll: async (params = {}) => {
        const response = await api.get('/organizers', { params });
        return response;
    },

    /**
     * Search organizers by query
     * @param {string} query - Search query
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Search results
     */
    search: async (query, params = {}) => {
        const response = await api.get('/organizers/search', {
            params: { query, ...params }
        });
        return response;
    },

    /**
     * Get single organizer by ID
     * @param {number|string} id - Organizer ID
     * @returns {Promise<Object>} Organizer details
     */
    getById: async (id) => {
        const response = await api.get(`/organizers/${id}`);
        return response;
    },

    /**
     * Create a new organizer profile
     * @param {Object} organizerData - Organizer data
     * @param {string} organizerData.name - Organizer/Company name
     * @param {string} organizerData.description - Description
     * @param {string} [organizerData.website] - Website URL
     * @param {string} [organizerData.phone] - Contact phone
     * @param {string} [organizerData.email] - Contact email
     * @param {number} organizerData.user_id - Associated user ID
     * @returns {Promise<Object>} Created organizer
     */
    create: async (organizerData) => {
        const response = await api.post('/organizers', organizerData);
        return response;
    },

    /**
     * Update an existing organizer
     * @param {number|string} id - Organizer ID
     * @param {Object} organizerData - Updated organizer data
     * @returns {Promise<Object>} Updated organizer
     */
    update: async (id, organizerData) => {
        const response = await api.put(`/organizers/${id}`, organizerData);
        return response;
    },

    /**
     * Delete an organizer
     * @param {number|string} id - Organizer ID
     * @returns {Promise<Object>} Deletion response
     */
    delete: async (id) => {
        const response = await api.delete(`/organizers/${id}`);
        return response;
    },

    /**
     * Get organizer's events
     * @param {number|string} organizerId - Organizer ID
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Organizer's events
     */
    getEvents: async (organizerId, params = {}) => {
        // This uses the events endpoint with organizer filter
        const response = await api.get('/events', {
            params: { organizer_id: organizerId, ...params }
        });
        return response;
    },

    /**
     * Get organizer dashboard statistics
     * @param {number|string} organizerId - Organizer ID
     * @returns {Promise<Object>} Dashboard stats (events count, tickets sold, revenue, etc.)
     */
    getDashboardStats: async (organizerId) => {
        // Note: This endpoint might need to be implemented on the backend
        const response = await api.get(`/organizers/${organizerId}/stats`);
        return response;
    },
};

export default organizerService;
