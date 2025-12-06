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
     * @param {string} [params.category] - Category slug filter
     * @param {string} [params.search] - Search query
     * @param {string} [params.location] - Location filter
     * @param {boolean} [params.upcoming] - Only upcoming events
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
     * Get single event by slug
     * @param {string} slug - Event slug
     * @returns {Promise<Object>} Event details
     */
    getBySlug: async (slug) => {
        const response = await api.get(`/events/${slug}`);
        return response;
    },

    /**
     * Create a new event
     * @param {Object} eventData - Event data
     * @param {string} eventData.title - Event title
     * @param {string} eventData.description - Event description
     * @param {string} eventData.start_time - Start time (ISO format)
     * @param {string} eventData.end_time - End time (ISO format)
     * @param {string} eventData.venue_name - Event venue
     * @param {string} eventData.address - Event address
     * @param {number} [eventData.event_type_id] - Event type ID
     * @param {string} [eventData.banner_image] - Banner image URL
     * @param {array} [eventData.tags] - Event tags
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
            params: { upcoming: 'true', ...params }
        });
        return response;
    },

    /**
     * Get featured events for homepage carousel
     * @param {number} limit - Number of events to return
     * @returns {Promise<Object>} List of featured events
     */
    getFeatured: async (limit = 5) => {
        const response = await api.get('/events/featured', {
            params: { limit }
        });
        return response;
    },

    /**
     * Get events by category
     * @param {string} categorySlug - Category slug
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Events in category
     */
    getByCategory: async (categorySlug, params = {}) => {
        const response = await api.get('/events', {
            params: { category: categorySlug, ...params }
        });
        return response;
    },

    /**
     * Publish an event (change status to published)
     * @param {number|string} id - Event ID
     * @returns {Promise<Object>} Updated event
     */
    publish: async (id) => {
        const response = await api.put(`/events/${id}`, { status: 'published' });
        return response;
    },

    /**
     * Cancel an event
     * @param {number|string} id - Event ID
     * @returns {Promise<Object>} Updated event
     */
    cancel: async (id) => {
        const response = await api.put(`/events/${id}`, { status: 'cancelled' });
        return response;
    },
};

export default eventService;
