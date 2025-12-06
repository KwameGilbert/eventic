/**
 * Order Service
 * 
 * Handles all order-related API calls including
 * order creation, Paystack payment, and order management.
 */

import api from './api';

// Paystack public key
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

const orderService = {
    /**
     * Create a new order from cart items
     * @param {Object} orderData - Order data
     * @param {Array} orderData.items - Array of {ticket_type_id, quantity}
     * @param {string} orderData.customer_email - Customer email
     * @param {string} orderData.customer_name - Customer name
     * @param {string} orderData.customer_phone - Customer phone (optional)
     * @returns {Promise<Object>} Created order with payment reference
     */
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response;
    },

    /**
     * Initialize Paystack payment for an order
     * @param {number} orderId - Order ID
     * @returns {Promise<Object>} Paystack authorization URL
     */
    initializePayment: async (orderId) => {
        const response = await api.post(`/orders/${orderId}/pay`);
        return response;
    },

    /**
     * Verify payment status
     * @param {number} orderId - Order ID
     * @param {string} reference - Paystack reference
     * @returns {Promise<Object>} Payment verification result
     */
    verifyPayment: async (orderId, reference) => {
        const response = await api.get(`/orders/${orderId}/verify`, {
            params: { reference }
        });
        return response;
    },

    /**
     * Transform cart items to backend format
     * Cart structure: { event: { ticketTypes: [{id, name, price}] }, tickets: { "TicketName": qty } }
     * Backend expects: [{ ticket_type_id: number, quantity: number }]
     * 
     * @param {Array} cartItems - Items from cart context
     * @returns {Array} Transformed items for backend
     */
    transformCartItems: (cartItems) => {
        const items = [];
        const errors = [];

        console.log('=== Cart Transformation Debug ===');
        console.log('Cart items:', JSON.stringify(cartItems, null, 2));

        cartItems.forEach((item, index) => {
            const ticketTypes = item.event?.ticketTypes || [];

            console.log(`\nEvent ${index + 1}: "${item.event?.title}"`);
            console.log('  Available ticket types:', ticketTypes.map(t => ({ id: t.id, name: t.name })));
            console.log('  Selected tickets:', item.tickets);

            Object.entries(item.tickets || {}).forEach(([ticketName, qty]) => {
                if (qty > 0) {
                    // Find matching ticket type by name
                    const ticketType = ticketTypes.find(t => t.name === ticketName);

                    if (!ticketType) {
                        const error = `Ticket type "${ticketName}" not found for event "${item.event?.title}"`;
                        console.error('  ERROR:', error);
                        errors.push(error);
                        return;
                    }

                    if (!ticketType.id) {
                        const error = `Ticket type "${ticketName}" is missing an ID. Events must be loaded from the API with proper ticket type IDs.`;
                        console.error('  ERROR:', error);
                        errors.push(error);
                        return;
                    }

                    console.log(`  ✓ Added: ${ticketName} (ID: ${ticketType.id}) x ${qty}`);
                    items.push({
                        ticket_type_id: ticketType.id,
                        quantity: parseInt(qty, 10)
                    });
                }
            });
        });

        console.log('\n=== Transformation Result ===');
        console.log('Items to send:', items);
        if (errors.length > 0) {
            console.error('Errors:', errors);
        }

        return items;
    },

    /**
     * Process checkout with Paystack inline
     * @param {Array} cartItems - Items from cart context
     * @param {Object} billingInfo - Customer billing info
     * @returns {Promise<Object>} Order and payment result
     */
    processCheckout: async (cartItems, billingInfo) => {
        try {
            // Transform cart items to backend format
            const items = orderService.transformCartItems(cartItems);

            // Validate we have items
            if (items.length === 0) {
                return {
                    success: false,
                    error: 'No valid ticket items found in cart. Make sure you are using events from the API (with ticket type IDs), not mock data.',
                };
            }

            // Create order on backend
            const orderResponse = await api.post('/orders', {
                items,
                customer_email: billingInfo.email,
                customer_name: `${billingInfo.firstName} ${billingInfo.lastName}`.trim(),
                customer_phone: billingInfo.phone || null,
            });

            // Handle different response formats
            const order = orderResponse.data || orderResponse;

            // Return order data for Paystack initialization
            return {
                success: true,
                order: order,
                paystack: {
                    key: PAYSTACK_PUBLIC_KEY,
                    email: order.customer_email || billingInfo.email,
                    amount: Math.round((order.total_amount || 0) * 100),
                    reference: order.reference,
                    orderId: order.order_id,
                }
            };

        } catch (error) {
            console.error('Checkout error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to create order',
            };
        }
    },

    /**
     * Get all orders for authenticated user
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} List of user's orders
     */
    getMyOrders: async (params = {}) => {
        const response = await api.get('/orders', { params });
        return response;
    },

    /**
     * Get single order by ID
     * @param {number} id - Order ID
     * @returns {Promise<Object>} Order details with tickets
     */
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response;
    },

    /**
     * Get user's tickets from all orders
     * @returns {Promise<Array>} List of tickets
     */
    getMyTickets: async () => {
        try {
            const ordersResponse = await api.get('/orders', {
                params: { status: 'paid' }
            });

            // Extract tickets from paid orders
            const orders = ordersResponse.data || [];
            const tickets = [];

            orders.forEach(order => {
                if (order.tickets) {
                    order.tickets.forEach(ticket => {
                        tickets.push({
                            ...ticket,
                            order: {
                                id: order.id,
                                total_amount: order.total_amount,
                                paid_at: order.paid_at,
                            }
                        });
                    });
                }
            });

            return tickets;
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            return [];
        }
    },

    /**
     * Calculate order totals (client-side helper)
     * @param {Array} cartItems - Cart items
     * @returns {Object} Price breakdown
     */
    calculateTotal: (cartItems) => {
        let subtotal = 0;
        let itemCount = 0;

        cartItems.forEach(item => {
            const ticketTypes = item.event?.ticketTypes || [];

            Object.entries(item.tickets || {}).forEach(([ticketName, qty]) => {
                if (qty > 0) {
                    const ticketType = ticketTypes.find(t => t.name === ticketName);
                    const price = parseFloat(ticketType?.price) || 0;
                    subtotal += price * qty;
                    itemCount += qty;
                }
            });
        });

        const fees = Math.round(subtotal * 0.015 * 100) / 100; // 1.5% fee
        const total = subtotal + fees;

        return {
            subtotal,
            fees,
            total,
            itemCount,
            currency: 'GHS',
            currencySymbol: 'GH₵',
        };
    },

    /**
     * Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    formatCurrency: (amount) => {
        return `GH₵${parseFloat(amount || 0).toFixed(2)}`;
    },
};

export default orderService;
