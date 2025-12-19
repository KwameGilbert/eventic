/**
 * Vote Service
 * 
 * Handles all voting-related API calls including
 * vote initiation, payment, and verification.
 */

import api from './api';

const voteService = {
    /**
     * Initiate a vote (create pending vote)
     * @param {number} nomineeId - Nominee ID
     * @param {Object} voteData - Vote data
     * @param {number} voteData.number_of_votes - Number of votes to purchase
     * @param {string} voteData.voter_email - Voter's email
     * @param {string} [voteData.voter_name] - Voter's name (optional)
     * @param {string} [voteData.voter_phone] - Voter's phone (optional)
     * @returns {Promise<Object>} Vote details with payment info
     */
    initiateVote: async (nomineeId, voteData) => {
        const response = await api.post(`/votes/nominees/${nomineeId}`, voteData);
        return response;
    },

    /**
     * Confirm vote payment (called after Paystack payment)
     * @param {string} reference - Payment reference from Paystack
     * @returns {Promise<Object>} Confirmation result
     */
    confirmPayment: async (reference) => {
        const response = await api.post('/votes/confirm', { reference });
        return response;
    },

    /**
     * Get vote details by reference
     * @param {string} reference - Vote reference
     * @returns {Promise<Object>} Vote details
     */
    getByReference: async (reference) => {
        const response = await api.get(`/votes/reference/${reference}`);
        return response;
    },

    /**
     * Get votes for a nominee
     * @param {number} nomineeId - Nominee ID
     * @param {Object} params - Query parameters
     * @param {string} [params.status] - Filter by status (pending|paid)
     * @returns {Promise<Object>} List of votes
     */
    getByNominee: async (nomineeId, params = {}) => {
        const response = await api.get(`/votes/nominees/${nomineeId}`, { params });
        return response;
    },

    /**
     * Get votes for a category
     * @param {number} categoryId - Category ID
     * @param {Object} params - Query parameters
     * @param {string} [params.status] - Filter by status (pending|paid)
     * @returns {Promise<Object>} List of votes
     */
    getByCategory: async (categoryId, params = {}) => {
        const response = await api.get(`/votes/award-categories/${categoryId}`, { params });
        return response;
    },

    /**
     * Get category leaderboard
     * @param {number} categoryId - Category ID
     * @returns {Promise<Object>} Leaderboard data
     */
    getLeaderboard: async (categoryId) => {
        const response = await api.get(`/votes/award-categories/${categoryId}/leaderboard`);
        return response;
    },

    /**
     * Get event votes (organizer only)
     * @param {number} eventId - Event ID
     * @param {Object} params - Query parameters
     * @param {string} [params.status] - Filter by status (pending|paid)
     * @returns {Promise<Object>} List of votes
     */
    getByEvent: async (eventId, params = {}) => {
        const response = await api.get(`/votes/events/${eventId}`, { params });
        return response;
    },

    /**
     * Get event vote statistics (organizer only)
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} Vote statistics
     */
    getEventStats: async (eventId) => {
        const response = await api.get(`/votes/events/${eventId}/stats`);
        return response;
    },

    /**
     * Calculate vote cost
     * @param {number} numberOfVotes - Number of votes
     * @param {number} costPerVote - Cost per vote
     * @returns {Object} Calculated costs
     */
    calculateCost: (numberOfVotes, costPerVote) => {
        const subtotal = numberOfVotes * costPerVote;
        const fees = 0; // No processing fee for votes currently
        const total = subtotal + fees;

        return {
            numberOfVotes,
            costPerVote,
            subtotal,
            fees,
            total
        };
    },
};

export default voteService;
