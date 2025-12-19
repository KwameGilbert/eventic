/**
 * Finance Service
 * 
 * Handles all financial-related API calls for organizers
 * Including revenue tracking, payouts, and financial analytics
 */

import api from './api';

const financeService = {
    /**
     * Get financial overview with combined events + awards revenue
     * @returns {Promise<Object>} Financial overview data
     */
    getOverview: async () => {
        const response = await api.get('/organizers/finance/overview');
        return response;
    },

    /**
     * Get detailed events revenue
     * @returns {Promise<Object>} Events revenue data
     */
    getEventsRevenue: async () => {
        const response = await api.get('/organizers/finance/events');
        return response;
    },

    /**
     * Get detailed awards voting revenue
     * @returns {Promise<Object>} Awards revenue data
     */
    getAwardsRevenue: async () => {
        const response = await api.get('/organizers/finance/awards');
        return response;
    },

    /**
     * Request payout for selected events/awards
     * @param {Object} payoutData - Payout request data
     * @param {Array} [payoutData.event_ids] - Array of event IDs to include
     * @param {Array} [payoutData.award_ids] - Array of award IDs to include
     * @param {string} payoutData.payment_method - 'mobile_money' or 'bank_transfer'
     * @param {Object} payoutData.account_details - Payment account details
     * @returns {Promise<Object>} Payout request response
     */
    requestPayout: async (payoutData) => {
        const response = await api.post('/organizers/payouts/request', payoutData);
        return response;
    },

    /**
     * Get payout history
     * @param {Object} params - Query parameters
     * @param {string} [params.status] - Filter by status
     * @param {number} [params.page] - Page number
     * @param {number} [params.per_page] - Items per page
     * @returns {Promise<Object>} Payout history
     */
    getPayoutHistory: async (params = {}) => {
        const response = await api.get('/organizers/payouts', { params });
        return response;
    },

    /**
     * Get single payout details
     * @param {number|string} payoutId - Payout ID
     * @returns {Promise<Object>} Payout details
     */
    getPayoutDetails: async (payoutId) => {
        const response = await api.get(`/organizers/payouts/${payoutId}`);
        return response;
    },

    /**
     * Calculate totals for selected items
     * @param {Array} selectedEvents - Array of event objects
     * @param {Array} selectedAwards - Array of award objects
     * @returns {Object} Calculated totals
     */
    calculateSelectedTotal: (selectedEvents = [], selectedAwards = []) => {
        const eventsTotal = selectedEvents.reduce((sum, event) => sum + (event.net_revenue || 0), 0);
        const awardsTotal = selectedAwards.reduce((sum, award) => sum + (award.net_revenue || 0), 0);

        return {
            events: eventsTotal,
            awards: awardsTotal,
            total: eventsTotal + awardsTotal
        };
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

    /**
     * Get revenue type color
     * @param {string} type - 'events' or 'awards'
     * @returns {string} Color hex code
     */
    getRevenueColor: (type) => {
        const colors = {
            events: '#3B82F6',  // Blue
            awards: '#8B5CF6',  // Purple
            total: '#10B981',   // Green
        };
        return colors[type] || colors.total;
    },
};

export default financeService;
