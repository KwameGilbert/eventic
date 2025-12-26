import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email) {
            setError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/auth/password/forgot', { email });
            setIsSubmitted(true);
        } catch {
            // Always show success message for security (don't reveal if email exists)
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Success State
    if (isSubmitted) {
        return (
            <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        {/* Success Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Check Your Email
                        </h1>

                        <p className="text-gray-600 mb-6">
                            If an account exists with <strong>{email}</strong>, we&apos;ve sent a password reset link. Please check your inbox and spam folder.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> The reset link will expire in 1 hour for security reasons.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                }}
                                className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                            >
                                Try a different email
                            </button>

                            <Link
                                to="/signin"
                                className="block w-full text-center py-3 px-4 bg-[var(--brand-primary)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Form State
    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    {/* Back Link */}
                    <Link
                        to="/signin"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </Link>

                    {/* Header */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-600 mb-6">
                        No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                autoComplete="email"
                                autoFocus
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    SENDING...
                                </>
                            ) : (
                                'SEND RESET LINK'
                            )}
                        </button>
                    </form>

                    {/* Help Text */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Remember your password?{' '}
                        <Link to="/signin" className="text-[var(--brand-primary)] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
