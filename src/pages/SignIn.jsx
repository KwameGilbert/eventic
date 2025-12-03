import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated()) {
            const from = location.state?.from || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Mock login - accepts any username/password
            await login(formData.username, formData.password);

            // Redirect to previous page or home
            const from = location.state?.from || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError('Failed to sign in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = async (provider) => {
        setIsLoading(true);
        try {
            // Mock social login
            await login(`${provider}@example.com`, 'password');
            const from = location.state?.from || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError(`Failed to sign in with ${provider}`);
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

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Social Sign In Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={() => handleSocialSignIn('facebook')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-[#3b5998] hover:bg-[#334d84] text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Facebook size={20} fill="currentColor" />
                            SIGN IN VIA FACEBOOK
                        </button>

                        <button
                            onClick={() => handleSocialSignIn('google')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-full border-2 border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            SIGN IN VIA GOOGLE
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-[var(--brand-primary)] font-semibold">OR</span>
                        </div>
                    </div>

                    {/* Sign In Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username or Email"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50"
                                required
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
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Remember Me Checkbox */}
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

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <Link
                                to="/forgot-password"
                                className="text-[var(--brand-primary)] hover:underline font-medium"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center text-gray-700">
                            Not a member yet?{' '}
                            <Link
                                to="/signup/attendee"
                                className="text-[var(--brand-primary)] hover:underline font-semibold"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>

                    {/* Demo Note */}
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 text-center">
                            <strong>Demo Mode:</strong> Enter any username and password to sign in
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
