/**
 * Order Service
 * 
 * Handles all order-related API calls including
 * order creation, retrieval, and payment processing.
 */

import api from './api';

const orderService = {
    /**
     * Get all orders for authenticated user
     * @param {Object} params - Query parameters
     * @param {number} [params.page] - Page number
     * @param {number} [params.per_page] - Items per page
     * @param {string} [params.status] - Order status filter
     * @returns {Promise<Object>} List of user's orders
     */
    getMyOrders: async (params = {}) => {
        const response = await api.get('/orders', { params });
        return response;
    },

    /**
     * Get single order by ID
     * @param {number|string} id - Order ID
     * @returns {Promise<Object>} Order details with tickets
     */
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response;
    },

    /**
     * Create a new order (checkout)
     * @param {Object} orderData - Order data
     * @param {Array} orderData.items - Array of order items
     * @param {number} orderData.items[].ticket_type_id - Ticket type ID
     * @param {number} orderData.items[].quantity - Quantity to purchase
     * @param {Object} [orderData.billing] - Billing information
     * @param {string} [orderData.payment_method] - Payment method
     * @returns {Promise<Object>} Created order with payment info
     */
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response;
    },

    /**
     * Process checkout from cart
     * @param {Array} cartItems - Items from cart context
     * @param {Object} billingInfo - Billing information
     * @param {string} paymentMethod - Selected payment method
     * @returns {Promise<Object>} Order result
     */
    checkout: async (cartItems, billingInfo = {}, paymentMethod = 'card') => {
        const items = cartItems.map(item => ({
            ticket_type_id: item.ticketTypeId || item.ticket_type_id,
            quantity: item.quantity,
        }));

        const response = await api.post('/orders', {
            items,
            billing: billingInfo,
            payment_method: paymentMethod,
        });

        return response;
    },

    /**
     * Get order history with pagination
     * @param {number} page - Page number
     * @param {number} perPage - Items per page
     * @returns {Promise<Object>} Paginated order history
     */
    getOrderHistory: async (page = 1, perPage = 10) => {
        const response = await api.get('/orders', {
            params: { page, per_page: perPage }
        });
        return response;
    },

    /**
     * Get orders by status
     * @param {string} status - Order status (pending, completed, cancelled, etc.)
     * @param {Object} params - Additional query parameters
     * @returns {Promise<Object>} Filtered orders
     */
    getOrdersByStatus: async (status, params = {}) => {
        const response = await api.get('/orders', {
            params: { status, ...params }
        });
        return response;
    },

    /**
     * Calculate order total (client-side helper)
     * @param {Array} items - Order items with price and quantity
     * @returns {Object} Price breakdown
     */
    calculateTotal: (items) => {
        const subtotal = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const serviceFee = subtotal * 0.05; // 5% service fee
        const total = subtotal + serviceFee;

        return {
            subtotal,
            serviceFee,
            total,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        };
    },
};

export default orderService;
