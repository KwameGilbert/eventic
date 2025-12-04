import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketContext = createContext();

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within TicketProvider');
    }
    return context;
};

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load tickets from localStorage on mount
        const storedTickets = localStorage.getItem('my_tickets');
        if (storedTickets) {
            try {
                setTickets(JSON.parse(storedTickets));
            } catch (error) {
                console.error('Error loading tickets from localStorage:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        // Save tickets to localStorage whenever it changes
        if (isLoaded) {
            localStorage.setItem('my_tickets', JSON.stringify(tickets));
        }
    }, [tickets, isLoaded]);

    const addTickets = (newTickets) => {
        setTickets(prev => [...newTickets, ...prev]);
    };

    return (
        <TicketContext.Provider value={{ tickets, addTickets }}>
            {children}
        </TicketContext.Provider>
    );
};
