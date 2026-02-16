/**
 * Award Service
 *
 * Handles all award-related API calls including
 * CRUD operations, search functionality, and leaderboards.
 */

import api from "./api";

const awardService = {
  /**
   * Get all awards with optional filters
   * @param {Object} params - Query parameters
   * @param {string} [params.status] - Award status filter
   * @param {number} [params.organizer_id] - Organizer ID filter
   * @param {string} [params.search] - Search query
   * @param {boolean} [params.upcoming] - Only upcoming awards
   * @param {boolean} [params.voting_open] - Only awards with open voting
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.per_page] - Items per page
   * @returns {Promise<Object>} List of awards
   */
  getAll: async (params = {}) => {
    const response = await api.get("/awards", { params });
    return response;
  },

  /**
   * Get featured awards for homepage carousel
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {boolean} [params.upcoming] - Only upcoming awards
   * @param {boolean} [params.voting_open] - Only awards with open voting
   * @returns {Promise<Object>} List of featured awards
   */
  getFeatured: async (params = {}) => {
    const response = await api.get("/awards/featured", { params });
    return response;
  },

  /**
   * Search awards by query
   * @param {string} query - Search query
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} Search results
   */
  search: async (query, params = {}) => {
    const response = await api.get("/awards/search", {
      params: { query, ...params },
    });
    return response;
  },

  /**
   * Get single award by ID
   * @param {number|string} id - Award ID
   * @returns {Promise<Object>} Award details
   */
  getById: async (id) => {
    const response = await api.get(`/awards/${id}`);
    return response;
  },

  /**
   * Get single award by slug
   * @param {string} slug - Award slug
   * @returns {Promise<Object>} Award details
   */
  getBySlug: async (slug) => {
    const response = await api.get(`/awards/${slug}`);
    return response;
  },

  /**
   * Get award leaderboard (all categories and nominees)
   * @param {number|string} id - Award ID
   * @returns {Promise<Object>} Award leaderboard data
   */
  getLeaderboard: async (id) => {
    const response = await api.get(`/awards/${id}/leaderboard`);
    return response;
  },

  /**
   * Create a new award
   * @param {Object|FormData} awardData - Award data (Object or FormData for file uploads)
   * @param {string} awardData.title - Award title
   * @param {string} awardData.description - Award description
   * @param {string} awardData.ceremony_date - Ceremony date (ISO format)
   * @param {string} awardData.voting_start - Voting start date
   * @param {string} awardData.voting_end - Voting end date
   * @param {string} awardData.venue_name - Award venue
   * @param {string} awardData.address - Award address
   * @param {string} [awardData.banner_image] - Banner image URL or File
   * @returns {Promise<Object>} Created award
   */
  create: async (awardData) => {
    // Check if awardData is FormData (for file uploads)
    const isFormData = awardData instanceof FormData;

    const config = isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {};

    const response = await api.post("/awards", awardData, config);
    return response;
  },

  /**
   * Create a new award with FormData (for file uploads)
   * @param {Object} awardData - Award data
   * @param {File} bannerImage - Banner image file (optional)
   * @param {Array} awardPhotos - Optional array of award photo files
   * @returns {Promise<Object>} Created award
   */
  createWithFormData: async (
    awardData,
    bannerImage = null,
    awardPhotos = [],
  ) => {
    const formData = new FormData();

    // Append all award data fields
    Object.keys(awardData).forEach((key) => {
      const value = awardData[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Append banner image if provided
    if (bannerImage) {
      formData.append("banner_image", bannerImage);
    }

    // Append award photos if provided
    if (awardPhotos && awardPhotos.length > 0) {
      awardPhotos.forEach((photo, index) => {
        if (photo.file) {
          formData.append(`award_photos[${index}]`, photo.file);
        }
      });
    }

    // Use axios with FormData
    const response = await api.post("/awards", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  /**
   * Update an existing award
   * @param {number|string} id - Award ID
   * @param {Object|FormData} awardData - Updated award data (Object or FormData for file uploads)
   * @returns {Promise<Object>} Updated award
   */
  update: async (id, awardData) => {
    // Check if awardData is FormData (for file uploads)
    const isFormData = awardData instanceof FormData;

    const config = isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {};

    const response = await api.put(`/awards/${id}`, awardData, config);
    return response;
  },

  /**
   * Delete an award
   * @param {number|string} id - Award ID
   * @returns {Promise<Object>} Deletion response
   */
  delete: async (id) => {
    const response = await api.delete(`/awards/${id}`);
    return response;
  },

  /**
   * Get awards by organizer
   * @param {number|string} organizerId - Organizer ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} Organizer's awards
   */
  getByOrganizer: async (organizerId, params = {}) => {
    const response = await api.get("/awards", {
      params: { organizer_id: organizerId, ...params },
    });
    return response;
  },

  /**
   * Get upcoming awards
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of upcoming awards
   */
  getUpcoming: async (params = {}) => {
    const response = await api.get("/awards", {
      params: { upcoming: "true", ...params },
    });
    return response;
  },

  /**
   * Increment award views
   * @param {number|string} id - Award ID or slug
   * @returns {Promise<Object>} View count response
   */
  incrementViews: async (id) => {
    try {
      const response = await api.post(`/awards/${id}/view`);
      return response;
    } catch (error) {
      console.warn("Failed to track award view:", error);
      return null;
    }
  },

  // ============================================
  // ORGANIZER-SPECIFIC METHODS
  // ============================================

  /**
   * Get awards data for organizer's Awards page
   * Fetches all awards with stats, status counts, and award details.
   * Similar to organizerService.getEventsData()
   * @returns {Promise<Object>} Awards data with stats, tabs, and awards list
   */
  getAwardsData: async () => {
    const response = await api.get("/organizers/data/awards");
    return response;
  },

  /**
   * Get detailed award data for organizer's View Award page
   * Includes stats, categories, nominees, voting analytics, etc.
   * Similar to organizerService.getEventDetails()
   * @param {number|string} awardId - Award ID
   * @returns {Promise<Object>} Comprehensive award data
   */
  getAwardDetails: async (awardId) => {
    const response = await api.get(`/organizers/data/awards/${awardId}`);
    return response;
  },

  /**
   * Get award statistics for organizer dashboard
   * Returns aggregated stats for all organizer's awards
   * @returns {Promise<Object>} Award statistics (total, active voting, etc.)
   */
  getOrganizerAwardStats: async () => {
    const response = await api.get("/organizers/data/awards/stats");
    return response;
  },

  /**
   * Submit award for approval (changes status from draft to pending)
   * @param {number|string} awardId - Award ID
   * @returns {Promise<Object>} Submission response
   */
  submitForApproval: async (awardId) => {
    const response = await api.put(`/awards/${awardId}/submit-for-approval`);
    return response;
  },

  /**
   * Toggle award-wide voting status
   * @param {number|string} awardId - Award ID
   * @param {string} status - 'open' or 'closed'
   * @returns {Promise<Object>} Toggle response
   */
  toggleVoting: async (awardId, status) => {
    const response = await api.put(`/awards/${awardId}/toggle-voting`, {
      voting_status: status,
    });
    return response;
  },
};

export default awardService;
