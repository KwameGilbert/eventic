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
     * Create a new event with FormData (for file uploads)
     * @param {Object} eventData - Event data
     * @param {File} bannerImage - Banner image file (optional)
     * @returns {Promise<Object>} Created event
     */
    createWithFormData: async (eventData, bannerImage = null) => {
        const formData = new FormData();

        // Append all event data fields
        Object.keys(eventData).forEach(key => {
            const value = eventData[key];
            if (value !== null && value !== undefined) {
                if (key === 'tags' && Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        // Append banner image if provided
        if (bannerImage) {
            formData.append('banner_image', bannerImage);
        }

        // Use axios directly with FormData (no Content-Type header - browser sets it automatically)
        const response = await api.post('/events', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
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

    /**
     * Get all event types (categories) for dropdown selection
     * @returns {Promise<Object>} List of event types
     */
    getEventTypes: async () => {
        const response = await api.get('/events/types');
        return response;
    },

    /**
     * Increment event views
     * @param {number|string} id - Event ID or slug
     * @returns {Promise<Object>} View count response
     */
    incrementViews: async (id) => {
        try {
            const response = await api.post(`/events/${id}/view`);
            return response;
        } catch (error) {
            console.warn('Failed to track event view:', error);
            return null;
        }
    },

    /**
     * Create a new event with ticket types in a single call
     * This creates the event first, then creates all ticket types for it
     * @param {Object} eventData - Event data
     * @param {Array} tickets - Array of ticket type objects
     * @param {File} bannerImage - Optional banner image file
     * @param {Array} eventPhotos - Optional array of event photo objects with 'file' property
     * @returns {Promise<Object>} Created event with tickets
     */
    createWithTickets: async (eventData, tickets = [], bannerImage = null, eventPhotos = []) => {
        // Use FormData to send event with tickets and images in a single request
        const formData = new FormData();

        // Append all event data fields
        Object.keys(eventData).forEach(key => {
            const value = eventData[key];
            if (value !== null && value !== undefined) {
                if (key === 'tags' && Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        // Append banner image if provided
        if (bannerImage) {
            formData.append('banner_image', bannerImage);
        }

        // Append event photos if provided
        if (eventPhotos && eventPhotos.length > 0) {
            eventPhotos.forEach((photo, index) => {
                if (photo.file) {
                    formData.append(`event_photos[${index}]`, photo.file);
                }
            });
        }

        // Append tickets data
        if (tickets && tickets.length > 0) {
            formData.append('tickets', JSON.stringify(tickets.map((ticket) => ({
                name: ticket.name,
                price: parseFloat(ticket.price) || 0,
                promoPrice: parseFloat(ticket.promoPrice) || 0,
                quantity: parseInt(ticket.quantity) || 0,
                maxPerOrder: parseInt(ticket.maxPerOrder) || 10,
                description: ticket.description || '',
                saleStartDate: ticket.saleStartDate || null,
                saleEndDate: ticket.saleEndDate || null,
            }))));

            // Append ticket images
            tickets.forEach((ticket, index) => {
                if (ticket.ticketImage) {
                    formData.append(`ticket_image_${index}`, ticket.ticketImage);
                }
            });
        }

        // Post with FormData
        const response = await api.post('/events', formData, {
            headers: {
                'Content-Type': undefined,
            },
            transformRequest: [(data) => data],
        });

        return response;
    },

    /**
     * Update an event with its ticket types
     * @param {number|string} eventId - Event ID
     * @param {Object} eventData - Event data to update
     * @param {Array} tickets - Array of ticket types (with 'id' for existing, without for new)
     * @param {Array} deletedTicketIds - Array of ticket IDs to delete
     * @param {File} bannerImage - Optional banner image file
     * @param {Array} eventPhotos - Optional array of new event photo objects with 'file' property
     * @returns {Promise<Object>} Updated event with ticket types
     */
    updateWithTickets: async (eventId, eventData, tickets = [], deletedTicketIds = [], bannerImage = null, eventPhotos = []) => {
        // Use FormData to send everything in one request
        const formData = new FormData();

        // Append all event data fields
        Object.keys(eventData).forEach(key => {
            const value = eventData[key];
            if (value !== null && value !== undefined) {
                if (key === 'tags' && Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        // Append banner image if provided
        if (bannerImage) {
            formData.append('banner_image', bannerImage);
        }

        // Append event photos if provided
        if (eventPhotos && eventPhotos.length > 0) {
            eventPhotos.forEach((photo, index) => {
                if (photo.file) {
                    formData.append(`event_photos[${index}]`, photo.file);
                }
            });
        }

        // Append deleted ticket IDs
        if (deletedTicketIds && deletedTicketIds.length > 0) {
            formData.append('deleted_tickets', JSON.stringify(deletedTicketIds));
        }

        // Append tickets data
        if (tickets && tickets.length > 0) {
            formData.append('tickets', JSON.stringify(tickets.map((ticket) => ({
                id: typeof ticket.id === 'number' ? ticket.id : undefined,
                name: ticket.name,
                price: parseFloat(ticket.price) || 0,
                promoPrice: parseFloat(ticket.promoPrice) || 0,
                quantity: parseInt(ticket.quantity) || 0,
                maxPerOrder: parseInt(ticket.maxPerOrder) || 10,
                description: ticket.description || '',
                saleStartDate: ticket.saleStartDate || null,
                saleEndDate: ticket.saleEndDate || null,
            }))));

            // Append ticket images
            tickets.forEach((ticket, index) => {
                if (ticket.ticketImage) {
                    formData.append(`ticket_image_${index}`, ticket.ticketImage);
                }
            });
        }

        // Use POST for update to handle multipart/form-data
        const response = await api.post(`/events/${eventId}`, formData, {
            headers: {
                'Content-Type': undefined, // Let axios set this automatically
            },
            transformRequest: [(data) => data], // Prevent axios from transforming the FormData
        });

        return response;
    },
};

export default eventService;

