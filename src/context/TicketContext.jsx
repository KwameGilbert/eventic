import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';
import { useAuth } from './AuthContext';

const TicketContext = createContext();

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within TicketProvider');
    }
    return context;
};

export const TicketProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch orders and tickets from API
     */
    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated()) {
            setOrders([]);
            setTickets([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.getMyOrders();
            const ordersData = response.data || response || [];

            // Set orders
            setOrders(Array.isArray(ordersData) ? ordersData : []);

            // Extract all tickets from paid orders
            const allTickets = [];
            ordersData.forEach(order => {
                // Only process paid orders with tickets
                if (order.status !== 'paid' || !order.tickets || !Array.isArray(order.tickets)) {
                    return;
                }

                // Build a map of ticket_type_id to ticket type info (including event)
                const ticketTypeMap = {};
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        if (item.ticket_type) {
                            ticketTypeMap[item.ticket_type_id] = {
                                ticketType: item.ticket_type,
                                event: item.ticket_type.event || {},
                            };
                        }
                    });
                }

                // Map each ticket with its event info
                order.tickets.forEach(ticket => {
                    const typeInfo = ticketTypeMap[ticket.ticket_type_id] || {};
                    const ticketType = typeInfo.ticketType || {};
                    const event = typeInfo.event || {};

                    allTickets.push({
                        ...ticket,
                        // Add order reference
                        order: {
                            id: order.id,
                            reference: order.payment_reference,
                            total_amount: order.total_amount,
                            paid_at: order.paid_at,
                            status: order.status,
                        },
                        // Map event data from the order items
                        event: {
                            id: event.id,
                            title: event.title,
                            slug: event.slug,
                            banner_image: event.banner_image,
                            venue_name: event.venue_name,
                            address: event.address,
                            start_time: event.start_time,
                            end_time: event.end_time,
                        },
                        // Ticket type name
                        ticketName: ticketType.name || 'General',
                        ticket_type: ticketType,
                        // QR code - use ticket_code from API
                        qrCode: ticket.ticket_code || ticket.id,
                    });
                });
            });

            setTickets(allTickets);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError('Failed to load your tickets');
            setOrders([]);
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch on mount and when auth changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, user]);

    /**
     * Get a specific order by ID
     */
    const getOrder = useCallback(async (orderId) => {
        try {
            const response = await orderService.getOrderById(orderId);
            return response.data || response;
        } catch (err) {
            console.error('Failed to fetch order:', err);
            throw err;
        }
    }, []);

    /**
     * Refresh orders (call after payment)
     */
    const refreshOrders = useCallback(() => {
        return fetchOrders();
    }, [fetchOrders]);

    /**
     * Get orders by status
     */
    const getOrdersByStatus = useCallback((status) => {
        if (!status) return orders;
        return orders.filter(order => order.status === status);
    }, [orders]);

    /**
     * Get paid orders only
     */
    const paidOrders = orders.filter(order => order.status === 'paid');

    /**
     * Get pending orders
     */
    const pendingOrders = orders.filter(order => order.status === 'pending');

    /**
     * Add tickets locally (for optimistic updates after payment)
     */
    const addTickets = (newTickets) => {
        setTickets(prev => [...newTickets, ...prev]);
    };

    return (
        <TicketContext.Provider value={{
            tickets,
            orders,
            paidOrders,
            pendingOrders,
            isLoading,
            error,
            fetchOrders,
            refreshOrders,
            getOrder,
            getOrdersByStatus,
            addTickets,
        }}>
            {children}
        </TicketContext.Provider>
    );
};
