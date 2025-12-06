import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication. Redirects to sign-in if not authenticated.
 * Can also check for specific roles (organizer, admin, attendee).
 * 
 * @param {React.ReactNode} children - Child components to render if authenticated
 * @param {string[]} allowedRoles - Optional array of roles that can access this route
 * @param {string} redirectTo - Where to redirect if not authenticated (default: /signin)
 */
const ProtectedRoute = ({
    children,
    allowedRoles = null,
    redirectTo = '/signin'
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
        // Redirect to sign-in, preserving the intended destination
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Check if specific roles are required
    if (allowedRoles && allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.includes(user?.role);

        if (!hasAllowedRole) {
            // User is authenticated but doesn't have the required role
            // Redirect to appropriate dashboard or home
            if (user?.role === 'organizer') {
                return <Navigate to="/organizer/dashboard" replace />;
            } else if (user?.role === 'admin') {
                return <Navigate to="/admin/dashboard" replace />;
            } else {
                return <Navigate to="/" replace />;
            }
        }
    }

    // User is authenticated (and has required role if specified)
    return children;
};

/**
 * OrganizerRoute - Shorthand for organizer-only routes
 */
export const OrganizerRoute = ({ children }) => (
    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
        {children}
    </ProtectedRoute>
);

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute = ({ children }) => (
    <ProtectedRoute allowedRoles={['admin']}>
        {children}
    </ProtectedRoute>
);

/**
 * AttendeeRoute - Shorthand for attendee routes (also allows organizer/admin)
 */
export const AttendeeRoute = ({ children }) => (
    <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
        {children}
    </ProtectedRoute>
);

export default ProtectedRoute;
