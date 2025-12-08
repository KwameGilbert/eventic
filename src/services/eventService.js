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
     * Create a new event with ticket types in a single call
     * This creates the event first, then creates all ticket types for it
     * @param {Object} eventData - Event data
     * @param {Array} tickets - Array of ticket type objects
     * @param {File} bannerImage - Optional banner image file
     * @param {Array} eventPhotos - Optional array of event photo objects with 'file' property
     * @returns {Promise<Object>} Created event with tickets
     */
    createWithTickets: async (eventData, tickets = [], bannerImage = null, eventPhotos = []) => {
        let eventResponse;

        // Check if we have any files to upload
        const hasFiles = bannerImage || (eventPhotos && eventPhotos.length > 0);

        // If any files are provided, use FormData
        if (hasFiles) {
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

            // Post with FormData - DON'T set Content-Type header manually
            // Axios will set it automatically with the correct boundary
            eventResponse = await api.post('/events', formData, {
                headers: {
                    'Content-Type': undefined, // Let axios set this automatically
                },
                transformRequest: [(data) => data], // Prevent axios from transforming the FormData
            });
        } else {
            // Post as JSON
            eventResponse = await api.post('/events', eventData);
        }

        if (!eventResponse.success || !eventResponse.data) {
            return eventResponse; // Return error if event creation failed
        }

        const createdEvent = eventResponse.data;
        const createdTickets = [];

        // If no tickets, return just the event
        if (!tickets || tickets.length === 0) {
            return eventResponse;
        }

        // Create each ticket type for the event
        for (const ticket of tickets) {
            try {
                const ticketData = {
                    event_id: createdEvent.id,
                    organizer_id: createdEvent.organizer_id,
                    name: ticket.name,
                    price: parseFloat(ticket.price) || 0,
                    quantity: parseInt(ticket.quantity) || 0,
                    max_per_order: parseInt(ticket.maxPerOrder) || 10,
                    description: ticket.description || '',
                    sale_start_date: ticket.saleStartDate || null,
                    sale_end_date: ticket.saleEndDate || null,
                };

                // Add promo price if provided
                if (ticket.promoPrice) {
                    ticketData.promo_price = parseFloat(ticket.promoPrice);
                }

                const ticketResponse = await api.post('/ticket-types', ticketData);
                if (ticketResponse.success && ticketResponse.data) {
                    createdTickets.push(ticketResponse.data);
                }
            } catch (err) {
                console.error('Failed to create ticket type:', err);
            }
        }

        return {
            ...eventResponse,
            data: {
                ...createdEvent,
                ticket_types: createdTickets
            }
        };
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
        const updatedTickets = [];
        let eventResponse;

        // Check if we have any files to upload
        const hasFiles = bannerImage || (eventPhotos && eventPhotos.length > 0);

        // 1. Update the event itself
        if (hasFiles) {
            // Use FormData for file upload
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

            // Use POST for file upload update (PUT doesn't handle multipart/form-data well)
            eventResponse = await api.post(`/events/${eventId}`, formData, {
                headers: {
                    'Content-Type': undefined, // Let axios set this automatically
                },
                transformRequest: [(data) => data], // Prevent axios from transforming the FormData
            });
        } else {
            // Regular JSON update
            eventResponse = await api.put(`/events/${eventId}`, eventData);
        }

        if (!eventResponse.success) {
            throw new Error(eventResponse.message || 'Failed to update event');
        }

        const updatedEvent = eventResponse.data;

        // 2. Delete removed tickets
        for (const ticketId of deletedTicketIds) {
            try {
                await api.delete(`/ticket-types/${ticketId}`);
            } catch (err) {
                console.error('Failed to delete ticket type:', ticketId, err);
            }
        }

        // 3. Update or create tickets
        for (const ticket of tickets) {
            try {
                const ticketData = {
                    event_id: eventId,
                    name: ticket.name,
                    price: parseFloat(ticket.price) || 0,
                    quantity: parseInt(ticket.quantity) || 0,
                    max_per_order: parseInt(ticket.maxPerOrder) || 10,
                    description: ticket.description || '',
                    sale_start_date: ticket.saleStartDate || null,
                    sale_end_date: ticket.saleEndDate || null,
                };

                // Add promo price if provided
                if (ticket.promoPrice) {
                    ticketData.promo_price = parseFloat(ticket.promoPrice);
                }

                let ticketResponse;
                if (ticket.id && typeof ticket.id === 'number') {
                    // Update existing ticket
                    ticketResponse = await api.put(`/ticket-types/${ticket.id}`, ticketData);
                } else {
                    // Create new ticket
                    ticketResponse = await api.post('/ticket-types', ticketData);
                }

                if (ticketResponse.success && ticketResponse.data) {
                    updatedTickets.push(ticketResponse.data);
                }
            } catch (err) {
                console.error('Failed to update/create ticket type:', err);
            }
        }

        return {
            ...eventResponse,
            data: {
                ...updatedEvent,
                ticket_types: updatedTickets
            }
        };
    },
};

export default eventService;

