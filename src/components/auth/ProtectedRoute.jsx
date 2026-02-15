import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, LogOut, ArrowLeft } from 'lucide-react';

/**
 * RoleAccessDenied Component
 * Shows a message when user is logged in with wrong role
 */
const RoleAccessDenied = ({ requiredRole, currentRole, pageName = 'this page' }) => {
    const { logout } = useAuth();

    const roleDisplayNames = {
        attendee: 'Attendee',
        organizer: 'Organizer',
        admin: 'Administrator',
        super_admin: 'Super Admin',
        pos: 'POS User',
        scanner: 'Scanner',
    };

    const getRoleRedirect = (role) => {
        switch (role) {
            case 'organizer':
                return '/organizer/dashboard';
            case 'admin':
            case 'super_admin':
                return '/admin/dashboard';
            case 'attendee':
            default:
                return '/';
        }
    };

    const handleLogoutAndRedirect = async () => {
        await logout();
        // Will be redirected to signin by ProtectedRoute
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                {/* Warning Icon */}
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-amber-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Access Restricted
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-2">
                    You are currently signed in as <strong className="text-gray-900">{(roleDisplayNames[currentRole] || currentRole).toUpperCase().replace("_", " ")}</strong>.
                </p>
                <p className="text-gray-600 mb-6">
                    {pageName} is only accessible to <strong className="text-(--brand-primary)">{(roleDisplayNames[requiredRole] || requiredRole).toUpperCase().replace("_", " ")}</strong> accounts.
                </p>

                {/* Info Box */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-gray-600">
                        <strong>What you can do:</strong>
                    </p>
                    <ul className="text-sm text-gray-500 mt-2 space-y-1">
                        <li>• Go back to your dashboard</li>
                        <li>• Sign out and log in with a different account</li>
                        <li>• Create an {(roleDisplayNames[requiredRole] || requiredRole).toUpperCase().replace("_", " ")} account if you don&apos;t have one</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {/* Go to appropriate dashboard */}
                    <Link
                        to={getRoleRedirect(currentRole)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-(--brand-primary) text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Go to My Dashboard
                    </Link>

                    {/* Logout button */}
                    <button
                        onClick={handleLogoutAndRedirect}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out & Switch Account
                    </button>
                </div>

                {/* Create account link */}
                {requiredRole === 'attendee' && (
                    <p className="mt-6 text-sm text-gray-500">
                        Need an attendee account?{' '}
                        <Link to="/signup/attendee" className="text-(--brand-primary) font-medium hover:underline">
                            Create one here
                        </Link>
                    </p>
                )}
                {requiredRole === 'organizer' && (
                    <p className="mt-6 text-sm text-gray-500">
                        Want to organize events?{' '}
                        <Link to="/signup/organizer" className="text-(--brand-primary) font-medium hover:underline">
                            Become an organizer
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

RoleAccessDenied.propTypes = {
    requiredRole: PropTypes.string.isRequired,
    currentRole: PropTypes.string,
    pageName: PropTypes.string,
};

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication. Redirects to sign-in if not authenticated.
 * Can also check for specific roles (organizer, admin, attendee).
 * 
 * @param {React.ReactNode} children - Child components to render if authenticated
 * @param {string[]} allowedRoles - Optional array of roles that can access this route
 * @param {string} redirectTo - Where to redirect if not authenticated (default: /signin)
 * @param {boolean} showRoleError - If true, shows an error page instead of redirecting for role mismatch
 * @param {string} pageName - Name of the page to show in role error message
 */
const ProtectedRoute = ({
    children,
    allowedRoles = null,
    redirectTo = '/signin',
    showRoleError = false,
    pageName = 'this page'
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--brand-primary) mx-auto mb-4"></div>
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
            if (showRoleError) {
                // Show the role access denied page
                return (
                    <RoleAccessDenied
                        requiredRole={allowedRoles[0]}
                        currentRole={user?.role}
                        pageName={pageName}
                    />
                );
            } else {
                // Default behavior: redirect to appropriate dashboard
                if (user?.role === 'organizer') {
                    return <Navigate to="/organizer/dashboard" replace />;
                } else if (user?.role === 'admin' || user?.role === 'super_admin') {
                    return <Navigate to="/admin/dashboard" replace />;
                } else {
                    return <Navigate to="/" replace />;
                }
            }
        }
    }

    // User is authenticated (and has required role if specified)
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
    redirectTo: PropTypes.string,
    showRoleError: PropTypes.bool,
    pageName: PropTypes.string,
};

/**
 * OrganizerRoute - Shorthand for organizer-only routes
 * Shows role error if non-organizer is logged in
 */
export const OrganizerRoute = ({ children, pageName = 'Organizer Dashboard' }) => (
    <ProtectedRoute
        allowedRoles={['organizer', 'admin', 'super_admin']}
        showRoleError={true}
        pageName={pageName}
    >
        {children}
    </ProtectedRoute>
);

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute = ({ children, pageName = 'Admin Dashboard' }) => (
    <ProtectedRoute
        allowedRoles={['admin', 'super_admin']}
        showRoleError={true}
        pageName={pageName}
    >
        {children}
    </ProtectedRoute>
);

/**
 * AttendeeRoute - Shorthand for attendee-only routes
 * Shows role error if non-attendee (e.g., organizer) is logged in
 */
export const AttendeeRoute = ({ children, pageName = 'this page' }) => (
    <ProtectedRoute
        allowedRoles={['attendee']}
        showRoleError={true}
        pageName={pageName}
    >
        {children}
    </ProtectedRoute>
);

OrganizerRoute.propTypes = {
    children: PropTypes.node.isRequired,
    pageName: PropTypes.string,
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
    pageName: PropTypes.string,
};

AttendeeRoute.propTypes = {
    children: PropTypes.node.isRequired,
    pageName: PropTypes.string,
};

export default ProtectedRoute;
