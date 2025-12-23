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

    /**
     * Get current user's attendee profile
     * @returns {Promise<Object>} Attendee profile
     */
    getMyProfile: async () => {
        const response = await api.get('/attendees/me');
        return response;
    },

    /**
     * Update current user's attendee profile
     * @param {Object} profileData - Profile data to update
     * @param {string} [profileData.first_name] - First name
     * @param {string} [profileData.last_name] - Last name
     * @param {string} [profileData.phone] - Phone number
     * @param {string} [profileData.bio] - Bio text
     * @returns {Promise<Object>} Updated profile
     */
    updateMyProfile: async (profileData) => {
        const response = await api.put('/attendees/me', profileData);
        return response;
    },

    /**
     * Upload profile image for current attendee
     * @param {File} file - Image file to upload
     * @returns {Promise<Object>} Response with image URL
     */
    uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append('profile_image', file);

        const response = await api.post('/attendees/me/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },

    // =============== ORGANIZER ATTENDEE ENDPOINTS ===============

    /**
     * Get all attendees for organizer's events
     * @param {Object} params - Query parameters
     * @param {number} [params.event_id] - Filter by specific event
     * @param {string} [params.status] - Filter by status: 'checked-in' or 'not-checked-in'
     * @param {string} [params.search] - Search by name, email, or order ID
     * @returns {Promise<Object>} Attendees list with stats
     */
    getOrganizerAttendees: async (params = {}) => {
        const response = await api.get('/organizers/data/attendees', { params });
        return response;
    },

    /**
     * Send bulk email to selected attendees
     * @param {Object} emailData - Email data
     * @param {Array} emailData.attendee_ids - Array of attendee (ticket) IDs
     * @param {string} emailData.subject - Email subject
     * @param {string} emailData.message - Email message body
     * @returns {Promise<Object>} Send result with success/fail counts
     */
    sendBulkEmail: async (emailData) => {
        const response = await api.post('/organizers/data/attendees/send-email', emailData);
        return response;
    },
};

export default attendeeService;

