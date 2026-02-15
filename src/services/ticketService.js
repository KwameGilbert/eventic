/**
 * Ticket Service
 *
 * Handles all ticket-related API calls including
 * ticket types, ticket verification, and admission.
 */

import api from "./api";

const ticketService = {
  // ==========================================
  // TICKET TYPES (for events)
  // ==========================================

  /**
   * Get all ticket types (optionally filtered by event)
   * @param {Object} params - Query parameters
   * @param {number} [params.event_id] - Filter by event ID
   * @returns {Promise<Object>} List of ticket types
   */
  getTicketTypes: async (params = {}) => {
    const response = await api.get("/ticket-types", { params });
    return response;
  },

  /**
   * Get ticket types for a specific event
   * @param {number|string} eventId - Event ID
   * @returns {Promise<Object>} Event's ticket types
   */
  getTicketTypesByEvent: async (eventId) => {
    const response = await api.get("/ticket-types", {
      params: { event_id: eventId },
    });
    return response;
  },

  /**
   * Get single ticket type by ID
   * @param {number|string} id - Ticket type ID
   * @returns {Promise<Object>} Ticket type details
   */
  getTicketTypeById: async (id) => {
    const response = await api.get(`/ticket-types/${id}`);
    return response;
  },

  /**
   * Create a new ticket type (organizers only)
   * @param {Object|FormData} ticketTypeData - Ticket type data
   * @returns {Promise<Object>} Created ticket type
   */
  createTicketType: async (ticketTypeData) => {
    const response = await api.post("/ticket-types", ticketTypeData, {
      headers: {
        "Content-Type":
          ticketTypeData instanceof FormData
            ? "multipart/form-data"
            : "application/json",
      },
    });
    return response;
  },

  /**
   * Update an existing ticket type (organizers only)
   * @param {number|string} id - Ticket type ID
   * @param {Object|FormData} ticketTypeData - Updated ticket type data
   * @returns {Promise<Object>} Updated ticket type
   */
  updateTicketType: async (id, ticketTypeData) => {
    // If it's FormData, we use POST with _method=PUT to handle multipart/form-data issues in PHP
    if (ticketTypeData instanceof FormData) {
      ticketTypeData.append("_method", "PUT");
      const response = await api.post(`/ticket-types/${id}`, ticketTypeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    }

    const response = await api.put(`/ticket-types/${id}`, ticketTypeData);
    return response;
  },

  /**
   * Delete a ticket type (organizers only)
   * @param {number|string} id - Ticket type ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteTicketType: async (id) => {
    const response = await api.delete(`/ticket-types/${id}`);
    return response;
  },

  // ==========================================
  // TICKETS (purchased tickets)
  // ==========================================

  /**
   * Get all tickets (for authenticated user)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of user's tickets
   */
  getMyTickets: async (params = {}) => {
    const response = await api.get("/tickets", { params });
    return response;
  },

  /**
   * Get single ticket by ID
   * @param {number|string} id - Ticket ID
   * @returns {Promise<Object>} Ticket details
   */
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response;
  },

  /**
   * Verify a ticket (public endpoint)
   * @param {string} ticketCode - Ticket QR code or verification code
   * @returns {Promise<Object>} Verification result
   */
  verifyTicket: async (ticketCode) => {
    const response = await api.post("/tickets/verify", {
      ticket_code: ticketCode,
    });
    return response;
  },

  /**
   * Admit a ticket (mark as used/scanned)
   * @param {string} ticketCode - Ticket code to admit
   * @returns {Promise<Object>} Admission result
   */
  admitTicket: async (ticketCode) => {
    const response = await api.post("/tickets/admit", {
      ticket_code: ticketCode,
    });
    return response;
  },

  /**
   * Get ticket with QR code data
   * @param {number|string} id - Ticket ID
   * @returns {Promise<Object>} Ticket with QR code
   */
  getTicketWithQR: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response;
  },
};

export default ticketService;
