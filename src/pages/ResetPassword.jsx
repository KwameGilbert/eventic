import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle, XCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('form'); // form, success, error, invalid
    const [error, setError] = useState('');

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Validate URL params
    useEffect(() => {
        if (!token || !email) {
            setStatus('invalid');
        }
    }, [token, email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validatePassword = () => {
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/password/reset', {
                email,
                token,
                password: formData.password,
            });

            if (response.success) {
                setStatus('success');
            } else {
                setStatus('error');
                setError(response.message || 'Failed to reset password');
            }
        } catch (err) {
            setStatus('error');
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    // Invalid Link State
    if (status === 'invalid') {
        return (
            <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Invalid Reset Link
                        </h1>

                        <p className="text-gray-600 mb-6">
                            This password reset link is invalid or has expired. Please request a new password reset link.
                        </p>

                        <div className="space-y-3">
                            <Link
                                to="/forgot-password"
                                className="block w-full text-center py-3 px-4 bg-[var(--brand-primary)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                            >
                                Request New Link
                            </Link>

                            <Link
                                to="/signin"
                                className="block w-full text-center py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success State
    if (status === 'success') {
        return (
            <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Password Reset Successful!
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Your password has been reset successfully. You can now sign in with your new password.
                        </p>

                        <Link
                            to="/signin"
                            className="block w-full text-center py-3 px-4 bg-[var(--brand-primary)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Sign In Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (status === 'error') {
        return (
            <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Password Reset Failed
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {error || 'We couldn\'t reset your password. The link may have expired or already been used.'}
                        </p>

                        <div className="space-y-3">
                            <Link
                                to="/forgot-password"
                                className="block w-full text-center py-3 px-4 bg-[var(--brand-primary)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                            >
                                Request New Link
                            </Link>

                            <button
                                onClick={() => {
                                    setStatus('form');
                                    setFormData({ password: '', confirmPassword: '' });
                                    setError('');
                                }}
                                className="block w-full text-center py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                            >
                                Try Again
                            </button>
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
                        Reset Your Password
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Create a new password for your account. Make sure it&apos;s at least 8 characters long.
                    </p>

                    {/* Email Display */}
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Resetting password for: <strong className="text-gray-900">{email}</strong>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter new password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="text-sm text-gray-500">
                            <p className="font-medium mb-1">Password requirements:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                                    At least 8 characters
                                </li>
                                <li className={formData.password && formData.password === formData.confirmPassword ? 'text-green-600' : ''}>
                                    Passwords match
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || formData.password.length < 8 || formData.password !== formData.confirmPassword}
                            className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    RESETTING...
                                </>
                            ) : (
                                'RESET PASSWORD'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
