/**
 * Event Service
 * 
 * Handles all event-related API calls including
 * CRUD operations and search functionality.
 */

import api from './api';

const eventService = {
    /**
     * Get all events with optional filters
     * @param {Object} params - Query parameters
     * @param {string} [params.status] - Event status filter
     * @param {number} [params.event_type_id] - Event type ID filter
     * @param {number} [params.organizer_id] - Organizer ID filter
     * @param {number} [params.page] - Page number for pagination
     * @param {number} [params.per_page] - Items per page
     * @returns {Promise<Object>} List of events
     */
    getAll: async (params = {}) => {
        const response = await api.get('/events', { params });
        return response;
    },

    /**
     * Search events by query
     * @param {string} query - Search query
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Search results
     */
    search: async (query, params = {}) => {
        const response = await api.get('/events/search', {
            params: { query, ...params }
        });
        return response;
    },

    /**
     * Get single event by ID
     * @param {number|string} id - Event ID
     * @returns {Promise<Object>} Event details
     */
    getById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response;
    },

    /**
     * Create a new event
     * @param {Object} eventData - Event data
     * @param {string} eventData.title - Event title
     * @param {string} eventData.description - Event description
     * @param {string} eventData.start_date - Start date (ISO format)
     * @param {string} eventData.end_date - End date (ISO format)
     * @param {string} eventData.venue - Event venue
     * @param {string} eventData.address - Event address
     * @param {number} eventData.organizer_id - Organizer ID
     * @param {number} [eventData.event_type_id] - Event type ID
     * @returns {Promise<Object>} Created event
     */
    create: async (eventData) => {
        const response = await api.post('/events', eventData);
        return response;
    },

    /**
     * Update an existing event
     * @param {number|string} id - Event ID
     * @param {Object} eventData - Updated event data
     * @returns {Promise<Object>} Updated event
     */
    update: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response;
    },

    /**
     * Delete an event
     * @param {number|string} id - Event ID
     * @returns {Promise<Object>} Deletion response
     */
    delete: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response;
    },

    /**
     * Get events by organizer
     * @param {number|string} organizerId - Organizer ID
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Organizer's events
     */
    getByOrganizer: async (organizerId, params = {}) => {
        const response = await api.get('/events', {
            params: { organizer_id: organizerId, ...params }
        });
        return response;
    },

    /**
     * Get upcoming events
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} List of upcoming events
     */
    getUpcoming: async (params = {}) => {
        const response = await api.get('/events', {
            params: { status: 'published', ...params }
        });
        return response;
    },

    /**
     * Get featured events
     * @param {number} limit - Number of events to return
     * @returns {Promise<Object>} List of featured events
     */
    getFeatured: async (limit = 6) => {
        const response = await api.get('/events', {
            params: { status: 'published', per_page: limit }
        });
        return response;
    },
};

export default eventService;
