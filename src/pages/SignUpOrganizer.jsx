import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Briefcase } from 'lucide-react';

const SignUpOrganizer = () => {
    const [formData, setFormData] = useState({
        organizerName: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.repeatPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log('Sign up organizer:', formData);
        // TODO: Implement sign up logic
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 my-8">
            <div className="max-w-md w-full">
                {/* Sign Up Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-center text-[var(--text-primary)]">Sign Up as Organizer</h2>
                    <p className="text-lg font-semibold text-center mb-6 text-[var(--text-secondary)]">Take your events to the next level</p>

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
                                placeholder="Organizer name"
                                value={formData.organizerName}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
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
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
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
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
                                required
                            />
                        </div>

                        {/* Username Input */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
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
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
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
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
                                required
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
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
                                required
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
                            className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity text-lg"
                        >
                            CREATE ACCOUNT
                        </button>

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
