import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Facebook, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
            // Redirect to home after successful registration
            setTimeout(() => {
                navigate('/', {
                    state: { message: 'Registration successful! Welcome to Eventic.' }
                });
            }, 1500);
        } catch (err) {
            // Handle specific backend errors
            if (err.status === 409) {
                setFormError('An account with this email already exists');
            } else if (err.errors) {
                // Handle validation errors from backend
                const errorMessages = Object.values(err.errors).join('. ');
                setFormError(errorMessages);
            } else {
                setFormError(err.message || 'Registration failed. Please try again.');
            }
        }
    };

    const handleSocialSignUp = (provider) => {
        console.log(`Sign up with ${provider}`);
        // TODO: Implement social sign up logic with OAuth
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
            <div className="max-w-md w-full">
                {/* Sign Up Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 text-[var(--text-primary)]">Sign Up</h2>

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

                    {/* Social Sign Up Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={() => handleSocialSignUp('facebook')}
                            disabled={isLoading || success}
                            className="w-full flex items-center justify-center gap-2 bg-[#3b5998] hover:bg-[#334d84] text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Facebook size={20} fill="currentColor" />
                            SIGN UP VIA FACEBOOK
                        </button>

                        <button
                            onClick={() => handleSocialSignUp('google')}
                            disabled={isLoading || success}
                            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-full border-2 border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            SIGN UP VIA GOOGLE
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
