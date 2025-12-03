import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load cart from localStorage on mount
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        // Save cart to localStorage whenever it changes (but only after initial load)
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded]);

    const addToCart = (event, tickets) => {
        const newCartItem = {
            id: Date.now(),
            event: {
                id: event.id,
                title: event.title,
                eventSlug: event.eventSlug,
                date: event.date,
                time: event.time,
                venue: event.venue,
                location: event.location,
                country: event.country,
                image: event.image,
                organizer: event.organizer || 'Event Organizer',
                ticketTypes: event.ticketTypes // Save for price reference
            },
            tickets: tickets,
            addedAt: new Date().toISOString()
        };
        setCartItems(prev => [...prev, newCartItem]);
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    };

    const updateCartItemQuantity = (itemId, ticketName, newQuantity) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const updatedTickets = { ...item.tickets };
                if (newQuantity > 0) {
                    updatedTickets[ticketName] = newQuantity;
                } else {
                    delete updatedTickets[ticketName];
                }
                // If no tickets left, remove the item
                if (Object.keys(updatedTickets).length === 0) {
                    return null;
                }
                return { ...item, tickets: updatedTickets };
            }
            return item;
        }).filter(Boolean)); // Remove null items
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => {
            return total + Object.values(item.tickets).reduce((sum, qty) => sum + qty, 0);
        }, 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + Object.entries(item.tickets).reduce((sum, [ticketName, qty]) => {
                const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);
                const price = ticketType?.price || 0;
                return sum + (qty * price);
            }, 0);
        }, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart,
            getCartCount,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
