import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';

const SignUpAttendee = () => {
    const navigate = useNavigate();
    const { registerAttendee, isLoading, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        repeatPassword: '',
    });
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user types
        if (formError) setFormError('');
        if (error) clearError();
    };

    const validateForm = () => {
        // Validate name length (backend requires 2-255 chars)
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        if (fullName.length < 2) {
            setFormError('Please enter your first and last name');
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setFormError('Please enter a valid email address');
            return false;
        }

        // Validate password length (backend requires min 8 chars)
        if (formData.password.length < 8) {
            setFormError('Password must be at least 8 characters long');
            return false;
        }

        // Validate passwords match
        if (formData.password !== formData.repeatPassword) {
            setFormError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!validateForm()) {
            return;
        }

        try {
            // Combine first and last name for the backend 'name' field
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();

            await registerAttendee({
                name: fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined, // Only send if provided
            });

            setSuccess(true);
            showSuccess('Registration successful! Welcome to Eventic.');
            // Redirect to home after successful registration
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            // Handle specific backend errors
            let errorMessage = 'Registration failed. Please try again.';
            if (err.status === 409) {
                errorMessage = 'An account with this email already exists';
            } else if (err.errors) {
                errorMessage = Object.values(err.errors).join('. ');
            } else if (err.message) {
                errorMessage = err.message;
            }
            setFormError(errorMessage);
            showError(errorMessage);
        }
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
            <div className="max-w-md w-full">
                {/* Sign Up Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-center text-[var(--text-primary)]">Sign Up</h2>
                    <p className="text-sm text-center mb-6 text-gray-500">Create your account to discover events</p>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-center">
                                🎉 Registration successful! Redirecting...
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {(formError || error) && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-center text-sm">
                                {formError || error}
                            </p>
                        </div>
                    )}

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={isLoading || success}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                minLength={1}
                            />
                        </div>

                        {/* Last Name Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={isLoading || success}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                minLength={1}
                            />
                        </div>

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
                                disabled={isLoading || success}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        {/* Phone Input (optional) */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Phone size={20} />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone (optional)"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isLoading || success}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
                                placeholder="Password (min 8 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading || success}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Repeat Password Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                name="repeatPassword"
                                placeholder="Repeat password"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                disabled={isLoading || success}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Terms Agreement */}
                        <p className="text-sm text-center text-gray-600">
                            By clicking the Sign Up button, I agree to{' '}
                            <Link to="/terms" className="text-[var(--brand-primary)] hover:underline">
                                Terms of service
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-[var(--brand-primary)] hover:underline">
                                Privacy policy
                            </Link>
                        </p>

                        {/* Create Account Button */}
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating account...
                                </>
                            ) : success ? (
                                'Account Created!'
                            ) : (
                                'CREATE ACCOUNT'
                            )}
                        </button>

                        {/* Organizer Link */}
                        <div className="text-center text-gray-600 text-sm">
                            Want to host events?{' '}
                            <Link
                                to="/signup-organizer"
                                className="text-[var(--brand-primary)] hover:underline font-semibold"
                            >
                                Sign up as Organizer
                            </Link>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center text-gray-700">
                            Already have an account?{' '}
                            <Link
                                to="/signin"
                                className="text-[var(--brand-primary)] hover:underline font-semibold"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpAttendee;
