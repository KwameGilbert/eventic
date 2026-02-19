/**
 * Finance Service
 *
 * Handles all financial-related API calls for organizers
 * Including revenue tracking, payouts, and financial analytics
 */

import api from "./api";

const financeService = {
  /**
   * Get financial overview with combined events + awards revenue
   * @returns {Promise<Object>} Financial overview data
   */
  getOverview: async () => {
    const response = await api.get("/organizers/finance/overview");
    return response;
  },

  /**
   * Get detailed events revenue
   * @returns {Promise<Object>} Events revenue data
   */
  getEventsRevenue: async () => {
    const response = await api.get("/organizers/finance/events");
    return response;
  },

  /**
   * Get detailed awards voting revenue
   * @returns {Promise<Object>} Awards revenue data
   */
  getAwardsRevenue: async () => {
    const response = await api.get("/organizers/finance/awards");
    return response;
  },

  /**
   * Get organizer balance summary
   * @returns {Promise<Object>} Balance data
   */
  getBalance: async () => {
    const response = await api.get("/organizers/finance/balance");
    return response;
  },

  /**
   * Request payout for an event
   * @param {number} eventId - Event ID
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise<Object>} Payout request response
   */
  requestEventPayout: async (eventId, paymentDetails) => {
    const response = await api.post(
      `/organizers/finance/payouts/events/${eventId}`,
      paymentDetails,
    );
    return response;
  },

  /**
   * Request payout for an award
   * @param {number} awardId - Award ID
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise<Object>} Payout request response
   */
  requestAwardPayout: async (awardId, paymentDetails) => {
    const response = await api.post(
      `/organizers/finance/payouts/awards/${awardId}`,
      paymentDetails,
    );
    return response;
  },

  /**
   * Request payout for selected events/awards
   * @param {Object} payoutData - Payout request data
   * @param {Array} [payoutData.events] - Array of {id, amount} for events
   * @param {Array} [payoutData.awards] - Array of {id, amount} for awards
   * @param {string} payoutData.payment_method - 'mobile_money' or 'bank_transfer'
   * @param {Object} payoutData.payment_details - Payment account details
   * @returns {Promise<Object>} Payout request response
   */
  requestPayout: async (payoutData) => {
    const {
      events = [],
      awards = [],
      payment_method,
      payment_details,
    } = payoutData;

    const results = {
      success: true,
      events: [],
      awards: [],
      errors: [],
    };

    // Request payouts for events
    for (const event of events) {
      try {
        const response = await financeService.requestEventPayout(event.id, {
          payment_method,
          amount: event.amount,
          ...payment_details,
        });
        results.events.push(response.data);
      } catch (error) {
        results.errors.push({
          type: "event",
          id: event.id,
          error: error.message,
        });
        results.success = false;
      }
    }

    // Request payouts for awards
    for (const award of awards) {
      try {
        const response = await financeService.requestAwardPayout(award.id, {
          payment_method,
          amount: award.amount,
          ...payment_details,
        });
        results.awards.push(response.data);
      } catch (error) {
        results.errors.push({
          type: "award",
          id: award.id,
          error: error.message,
        });
        results.success = false;
      }
    }

    return results;
  },

  /**
   * Cancel a payout request
   * @param {number} payoutId - Payout request ID
   * @returns {Promise<Object>} Cancellation response
   */
  cancelPayout: async (payoutId) => {
    const response = await api.post(
      `/organizers/finance/payouts/${payoutId}/cancel`,
    );
    return response;
  },

  /**
   * Get payout history
   * @param {Object} params - Query parameters
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.type] - Filter by type (event/award)
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @returns {Promise<Object>} Payout history
   */
  getPayoutHistory: async (params = {}) => {
    const response = await api.get("/organizers/finance/payouts", { params });
    return response;
  },

  /**
   * Calculate totals for selected items
   * @param {Array} selectedEvents - Array of event objects
   * @param {Array} selectedAwards - Array of award objects
   * @returns {Object} Calculated totals
   */
  calculateSelectedTotal: (selectedEvents = [], selectedAwards = []) => {
    const eventsTotal = selectedEvents.reduce(
      (sum, event) => sum + (event.net_revenue || 0),
      0,
    );
    const awardsTotal = selectedAwards.reduce(
      (sum, award) => sum + (award.net_revenue || 0),
      0,
    );

    return {
      events: eventsTotal,
      awards: awardsTotal,
      total: eventsTotal + awardsTotal,
    };
  },

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: GHS)
   * @returns {string} Formatted currency string
   */
  formatCurrency: (amount, currency = "GHS") => {
    const value = amount || 0;
    if (currency === "GHS") {
      return `GH₵${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  /**
   * Get revenue type color
   * @param {string} type - 'events' or 'awards'
   * @returns {string} Color hex code
   */
  getRevenueColor: (type) => {
    const colors = {
      events: "#3B82F6", // Blue
      awards: "#8B5CF6", // Purple
      total: "#10B981", // Green
    };
    return colors[type] || colors.total;
  },
};

export default financeService;
