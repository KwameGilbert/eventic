/**
 * Attendee Service
 * 
 * Handles all attendee-related API calls including
 * profile management and attendee operations.
 */

import api from './api';

const attendeeService = {
    /**
     * Get all attendees
     * @param {Object} params - Query parameters
     * @param {number} [params.page] - Page number for pagination
     * @param {number} [params.per_page] - Items per page
     * @returns {Promise<Object>} List of attendees
     */
    getAll: async (params = {}) => {
        const response = await api.get('/attendees', { params });
        return response;
    },

    /**
     * Get single attendee by ID
     * @param {number|string} id - Attendee ID
     * @returns {Promise<Object>} Attendee details
     */
    getById: async (id) => {
        const response = await api.get(`/attendees/${id}`);
        return response;
    },

    /**
     * Create a new attendee profile
     * @param {Object} attendeeData - Attendee data
     * @param {number} attendeeData.user_id - Associated user ID
     * @param {string} [attendeeData.bio] - Attendee bio
     * @param {Object} [attendeeData.preferences] - Attendee preferences
     * @returns {Promise<Object>} Created attendee
     */
    create: async (attendeeData) => {
        const response = await api.post('/attendees', attendeeData);
        return response;
    },

    /**
     * Update an existing attendee profile
     * @param {number|string} id - Attendee ID
     * @param {Object} attendeeData - Updated attendee data
     * @returns {Promise<Object>} Updated attendee
     */
    update: async (id, attendeeData) => {
        const response = await api.put(`/attendees/${id}`, attendeeData);
        return response;
    },

    /**
     * Delete an attendee profile
     * @param {number|string} id - Attendee ID
     * @returns {Promise<Object>} Deletion response
     */
    delete: async (id) => {
        const response = await api.delete(`/attendees/${id}`);
        return response;
    },

    /**
     * Update attendee preferences
     * @param {number|string} id - Attendee ID
     * @param {Object} preferences - Preference settings
     * @returns {Promise<Object>} Updated attendee
     */
    updatePreferences: async (id, preferences) => {
        const response = await api.put(`/attendees/${id}`, {
            preferences
        });
        return response;
    },

    /**
     * Get attendee's tickets
     * Uses the tickets endpoint filtered by attendee
     * @param {number|string} attendeeId - Attendee ID
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Attendee's tickets
     */
    getTickets: async (attendeeId, params = {}) => {
        // Assuming tickets are fetched via the authenticated user endpoint
        const response = await api.get('/tickets', {
            params: { attendee_id: attendeeId, ...params }
        });
        return response;
    },

    /**
     * Get attendee's order history
     * @param {number|string} attendeeId - Attendee ID
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Order history
     */
    getOrders: async (attendeeId, params = {}) => {
        const response = await api.get('/orders', {
            params: { attendee_id: attendeeId, ...params }
        });
        return response;
    },
};

export default attendeeService;
