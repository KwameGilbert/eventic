import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, isOrganizer, error: authError, clearError } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Get any message passed from registration
    const successMessage = location.state?.message;

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            // Redirect organizers to their dashboard, others to home
            const defaultRedirect = isOrganizer() ? '/organizer/dashboard' : '/';
            const from = location.state?.from || defaultRedirect;
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isOrganizer, navigate, location]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear errors when user types
        if (error) setError('');
        if (authError) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please enter your email and password');
            setIsLoading(false);
            return;
        }

        try {
            const user = await login(formData.email, formData.password);

            // Redirect based on user role
            let redirectTo = location.state?.from || '/';
            if (user?.role === 'organizer') {
                redirectTo = location.state?.from || '/organizer/dashboard';
            } else if (user?.role === 'admin') {
                redirectTo = location.state?.from || '/admin/dashboard';
            }

            navigate(redirectTo, { replace: true });
        } catch (err) {
            // Handle specific backend errors
            if (err.status === 401) {
                setError('Invalid email or password');
            } else if (err.status === 403) {
                setError('Your account has been suspended. Please contact support.');
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Failed to sign in. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
            <div className="max-w-md w-full">
                {/* Sign In Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    {/* Header */}
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        Sign in
                    </h1>
                    {location.state?.from && (
                        <p className="text-center text-sm text-gray-600 mb-6">
                            Please sign in to continue
                        </p>
                    )}
                    {!location.state?.from && (
                        <div className="mb-6"></div>
                    )}

                    {/* Success Message (from registration) */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {(error || authError) && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                            {error || authError}
                        </div>
                    )}

                    {/* Sign In Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    id="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]"
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 font-medium">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-[var(--brand-primary)] hover:underline font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    SIGNING IN...
                                </>
                            ) : (
                                'SIGN IN'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">New to Eventic?</span>
                            </div>
                        </div>

                        {/* Sign Up Links */}
                        <div className="space-y-3">
                            <Link
                                to="/signup/attendee"
                                className="block w-full text-center py-3 px-4 border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold rounded-full hover:bg-[var(--brand-primary)] hover:text-white transition-colors"
                            >
                                Sign up as Attendee
                            </Link>
                            <Link
                                to="/signup/organizer"
                                className="block w-full text-center py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                            >
                                Sign up as Event Organizer
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
