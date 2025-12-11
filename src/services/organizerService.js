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
        const response = await api.get('/events', {
            params: { organizer_id: organizerId, ...params }
        });
        return response;
    },

    /**
     * Get organizer dashboard data
     * Fetches all necessary data for the organizer dashboard in a single call.
     * This includes stats, ticket sales, revenue charts, activities, orders, and events.
     * @returns {Promise<Object>} Complete dashboard data
     */
    getDashboard: async () => {
        const response = await api.get('/organizers/data/dashboard');
        return response;
    },

    /**
     * Get all events for the organizer's Events page
     * Fetches all events with stats, status counts, and event details.
     * @returns {Promise<Object>} Events data with stats, tabs, and events list
     */
    getEventsData: async () => {
        const response = await api.get('/organizers/data/events');
        return response;
    },

    /**
     * Get detailed event data for the organizer's View Event page
     * Includes stats, ticket types with sales data, attendees list, etc.
     * @param {number|string} eventId - Event ID
     * @returns {Promise<Object>} Comprehensive event data
     */
    getEventDetails: async (eventId) => {
        const response = await api.get(`/organizers/data/events/${eventId}`);
        return response;
    },

    /**
     * Get all orders for organizer's events
     * Fetches orders with stats, filters, and pagination
     * @param {Object} params - Query parameters
     * @param {string} [params.status] - Filter by status (all, paid, pending, cancelled, refunded)
     * @param {string} [params.search] - Search by order ID, customer name, or email
     * @param {number} [params.page] - Page number
     * @param {number} [params.per_page] - Items per page
     * @returns {Promise<Object>} Orders data with stats and pagination
     */
    getOrders: async (params = {}) => {
        const response = await api.get('/organizers/data/orders', { params });
        return response;
    },

    /**
     * Get single order details for organizer
     * Fetches complete order details including customer info, tickets, payment info, and timeline
     * @param {number|string} orderId - Order ID
     * @returns {Promise<Object>} Complete order details
     */
    getOrderDetails: async (orderId) => {
        const response = await api.get(`/organizers/data/orders/${orderId}`);
        return response;
    },

    /**
     * Get organizer dashboard statistics (legacy - use getDashboard instead)
     * @param {number|string} organizerId - Organizer ID
     * @returns {Promise<Object>} Dashboard stats (events count, tickets sold, revenue, etc.)
     * @deprecated Use getDashboard() instead
     */
    getDashboardStats: async (organizerId) => {
        // Note: This endpoint might need to be implemented on the backend
        const response = await api.get(`/organizers/${organizerId}/stats`);
        return response;
    },
};

export default organizerService;
