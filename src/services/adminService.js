/**
 * Admin Service
 *
 * Handles all admin-related API calls
 * Including dashboard data, user management, and approvals
 */

import api from "./api";

const adminService = {
  /**
   * Get admin dashboard data
   * @returns {Promise<Object>} Dashboard data
   */
  getDashboard: async () => {
    const response = await api.get("/admin/dashboard");
    return response;
  },

  /**
   * Get all users with optional filters
   * @param {Object} params - Query parameters
   * @param {string} [params.role] - Filter by role (admin, organizer, attendee)
   * @param {string} [params.search] - Search by name or email
   * @returns {Promise<Object>} Users data
   */
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response;
  },

  /**
   * Approve pending event
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Approval response
   */
  approveEvent: async (eventId) => {
    const response = await api.put(`/admin/events/${eventId}/approve`);
    return response;
  },

  /**
   * Reject pending event
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Rejection response
   */
  rejectEvent: async (eventId) => {
    const response = await api.put(`/admin/events/${eventId}/reject`);
    return response;
  },

  /**
   * Approve pending award
   * @param {number} awardId - Award ID
   * @returns {Promise<Object>} Approval response
   */
  approveAward: async (awardId) => {
    const response = await api.put(`/admin/awards/${awardId}/approve`);
    return response;
  },

  /**
   * Reject pending award
   * @param {number} awardId - Award ID
   * @returns {Promise<Object>} Rejection response
   */
  rejectAward: async (awardId) => {
    const response = await api.put(`/admin/awards/${awardId}/reject`);
    return response;
  },

  /**
   * Get single user details
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User details
   */
  getUser: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response;
  },

  /**
   * Update user status
   * @param {number} userId - User ID
   * @param {string} status - New status (active, inactive, suspended)
   * @returns {Promise<Object>} Update response
   */
  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response;
  },

  /**
   * Reset user password
   * @param {number} userId - User ID
   * @param {string} password - New password
   * @returns {Promise<Object>} Reset response
   */
  resetUserPassword: async (userId, password) => {
    const response = await api.post(`/admin/users/${userId}/reset-password`, {
      password,
    });
    return response;
  },

  /**
   * Update user role
   * @param {number} userId - User ID
   * @param {string} role - New role (admin, organizer, attendee, pos, scanner)
   * @returns {Promise<Object>} Update response
   */
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response;
  },

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  },

  /**
   * Create new user (Admin)
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Creation response
   */
  createUser: async (userData) => {
    const response = await api.post("/admin/users", userData);
    return response;
  },

  /**
   * Update user details (Admin/Super Admin)
   * @param {number} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Update response
   */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response;
  },

  // =====================================================
  // EVENT MANAGEMENT
  // =====================================================

  /**
   * Get all events (admin)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Events data
   */
  getEvents: async (params = {}) => {
    const response = await api.get("/admin/events", { params });
    return response;
  },

  /**
   * Toggle event featured status
   * @param {number} eventId - Event ID
   * @param {boolean} isFeatured - Featured status
   * @returns {Promise<Object>} Update response
   */
  toggleEventFeatured: async (eventId, isFeatured) => {
    const response = await api.put(`/admin/events/${eventId}/feature`, {
      is_featured: isFeatured,
    });
    return response;
  },

  /**
   * Update event status
   * @param {number} eventId - Event ID
   * @param {string} status - New status (draft, pending, published, cancelled, completed)
   * @returns {Promise<Object>} Update response
   */
  updateEventStatus: async (eventId, status) => {
    const response = await api.put(`/admin/events/${eventId}/status`, {
      status,
    });
    return response;
  },

  /**
   * Delete event
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/admin/events/${eventId}`);
    return response;
  },

  /**
   * Get single event details (admin)
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Event details
   */
  getEventDetails: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}`);
    return response;
  },

  /**
   * Update event (admin - full edit)
   * @param {number} eventId - Event ID
   * @param {Object} data - Event data to update
   * @returns {Promise<Object>} Update response
   */
  updateEvent: async (eventId, data) => {
    const response = await api.put(`/admin/events/${eventId}`, data);
    return response;
  },

  // =====================================================
  // AWARD MANAGEMENT
  // =====================================================

  /**
   * Get all awards (admin)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Awards data
   */
  getAwards: async (params = {}) => {
    const response = await api.get("/admin/awards", { params });
    return response;
  },

  /**
   * Toggle award featured status
   * @param {number} awardId - Award ID
   * @param {boolean} isFeatured - Featured status
   * @returns {Promise<Object>} Update response
   */
  toggleAwardFeatured: async (awardId, isFeatured) => {
    const response = await api.put(`/admin/awards/${awardId}/feature`, {
      is_featured: isFeatured,
    });
    return response;
  },

  /**
   * Update award status
   * @param {number} awardId - Award ID
   * @param {string} status - New status (draft, pending, published, completed, closed)
   * @returns {Promise<Object>} Update response
   */
  updateAwardStatus: async (awardId, status) => {
    const response = await api.put(`/admin/awards/${awardId}/status`, {
      status,
    });
    return response;
  },

  /**
   * Delete award
   * @param {number} awardId - Award ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteAward: async (awardId) => {
    const response = await api.delete(`/admin/awards/${awardId}`);
    return response;
  },

  /**
   * Get single award details (admin)
   * @param {number} awardId - Award ID
   * @returns {Promise<Object>} Award details
   */
  getAwardDetails: async (awardId) => {
    const response = await api.get(`/admin/awards/${awardId}`);
    return response;
  },

  /**
   * Update award (admin - full edit)
   * @param {number} awardId - Award ID
   * @param {Object} data - Award data to update
   * @returns {Promise<Object>} Update response
   */
  updateAward: async (awardId, data) => {
    const response = await api.put(`/admin/awards/${awardId}`, data);
    return response;
  },

  /**
   * Toggle award voting status (Admin override)
   * @param {number|string} awardId - Award ID
   * @param {string} status - 'open' or 'closed'
   * @returns {Promise<Object>} Update response
   */
  toggleVoting: async (awardId, status) => {
    const response = await api.put(`/awards/${awardId}/toggle-voting`, {
      voting_status: status,
    });
    return response;
  },

  // =====================================================
  // FINANCE & PAYOUTS MANAGEMENT
  // =====================================================

  /**
   * Get comprehensive finance overview
   * @returns {Promise<Object>} Finance overview data with charts/trends
   */
  getFinanceOverview: async () => {
    const response = await api.get("/admin/finance");
    return response;
  },

  /**
   * Get comprehensive analytics data
   * @param {Object} params - Query parameters
   * @param {string} [params.period] - Time period (7days, 30days, 90days, 12months, all)
   * @returns {Promise<Object>} Analytics data with trends, breakdowns, and top performers
   */
  getAnalytics: async (params = {}) => {
    const response = await api.get("/admin/analytics", { params });
    return response;
  },

  /**
   * Get all platform settings
   * @returns {Promise<Object>} Platform settings grouped by category
   */
  getSettings: async () => {
    const response = await api.get("/admin/settings");
    return response;
  },

  /**
   * Update platform settings
   * @param {Object} settings - Settings object grouped by category
   * @returns {Promise<Object>} Update result
   */
  updateSettings: async (settings) => {
    const response = await api.put("/admin/settings", settings);
    return response;
  },

  /**
   * Get all payouts with optional filters
   * @param {Object} params - Query parameters
   * @param {string} [params.status] - Filter by status (pending, processing, completed, rejected)
   * @param {string} [params.type] - Filter by type (event, award)
   * @returns {Promise<Object>} Payouts data
   */
  getPayouts: async (params = {}) => {
    const response = await api.get("/admin/payouts", { params });
    return response;
  },

  /**
   * Get payout summary statistics
   * @returns {Promise<Object>} Payout summary
   */
  getPayoutSummary: async () => {
    const response = await api.get("/admin/payouts/summary");
    return response;
  },

  /**
   * Approve a payout request
   * @param {number} payoutId - Payout ID
   * @param {string} [notes] - Optional notes
   * @returns {Promise<Object>} Approval response
   */
  approvePayout: async (payoutId, notes = null) => {
    const response = await api.post(`/admin/payouts/${payoutId}/approve`, {
      notes,
    });
    return response;
  },

  /**
   * Reject a payout request
   * @param {number} payoutId - Payout ID
   * @param {string} reason - Rejection reason (required)
   * @returns {Promise<Object>} Rejection response
   */
  rejectPayout: async (payoutId, reason) => {
    const response = await api.post(`/admin/payouts/${payoutId}/reject`, {
      reason,
    });
    return response;
  },

  /**
   * Mark a payout as completed
   * @param {number} payoutId - Payout ID
   * @param {string} [notes] - Optional notes
   * @returns {Promise<Object>} Completion response
   */
  completePayout: async (payoutId, notes = null) => {
    const response = await api.post(`/admin/payouts/${payoutId}/complete`, {
      notes,
    });
    return response;
  },

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: GHS)
   * @returns {string} Formatted currency string
   */
  formatCurrency: (amount, currency = "GHS") => {
    if (currency === "GHS") {
      return `GH₵${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },
};

export default adminService;
