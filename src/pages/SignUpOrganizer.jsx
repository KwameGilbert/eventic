import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUpOrganizer = () => {
    const navigate = useNavigate();
    const { registerOrganizer, isLoading, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        organizerName: '',
        firstName: '',
        lastName: '',
        email: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validate passwords match
        if (formData.password !== formData.repeatPassword) {
            setFormError('Passwords do not match!');
            return;
        }

        // Validate password length
        if (formData.password.length < 8) {
            setFormError('Password must be at least 8 characters long');
            return;
        }

        try {
            // Use organizer name as the 'name' field, or combine first+last if no organizer name
            const name = formData.organizerName || `${formData.firstName} ${formData.lastName}`.trim();

            await registerOrganizer({
                name: name,
                email: formData.email,
                password: formData.password,
                // Store additional info for later organizer profile creation
                organizerName: formData.organizerName,
            });

            setSuccess(true);
            // Redirect to organizer dashboard after successful registration
            setTimeout(() => {
                navigate('/organizer/dashboard', {
                    state: { message: 'Registration successful! Welcome to Eventic.' }
                });
            }, 1500);
        } catch (err) {
            setFormError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
            <div className="max-w-md w-full">
                {/* Sign Up Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-center text-[var(--text-primary)]">Sign Up as Organizer</h2>
                    <p className="text-lg font-semibold text-center mb-6 text-[var(--text-secondary)]">Take your events to the next level</p>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-center">
                                🎉 Registration successful! Redirecting to dashboard...
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
                        {/* Organizer Name Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Briefcase size={20} />
                            </div>
                            <input
                                type="text"
                                name="organizerName"
                                placeholder="Organization/Business name"
                                value={formData.organizerName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* First Name Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Your first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50"
                                required
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
                                placeholder="Your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50"
                                required
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
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow disabled:opacity-50"
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
                            disabled={isLoading}
                            className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating account...
                                </>
                            ) : (
                                'CREATE ORGANIZER ACCOUNT'
                            )}
                        </button>

                        {/* Attendee Link */}
                        <div className="text-center text-gray-600 text-sm">
                            Just looking to attend events?{' '}
                            <Link
                                to="/signup-attendee"
                                className="text-[var(--brand-primary)] hover:underline font-semibold"
                            >
                                Sign up as Attendee
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

export default SignUpOrganizer;
