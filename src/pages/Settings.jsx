import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: 'Event enthusiast and avid traveler.',
        phone: '+1 (555) 123-4567'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                        <p className="text-gray-500 mt-1">Manage your profile information</p>
                    </div>

                    <div className="p-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=f97316&color=fff'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                                <button className="absolute bottom-0 right-0 bg-(--brand-primary) text-white p-2 rounded-full shadow-lg hover:bg-(--brand-primary)/90 transition-colors">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">Click to upload new photo</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <User size={16} />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Mail size={16} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none bg-gray-50"
                                        placeholder="Enter your email"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-400">Email cannot be changed</p>
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            {/* Bio Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="Tell us a little about yourself..."
                                />
                            </div>

                            {/* Success Message */}
                            {successMessage && (
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    {successMessage}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-3 bg-(--brand-primary) text-white rounded-xl font-semibold hover:bg-(--brand-primary)/90 transition-all shadow-lg shadow-(--brand-primary)/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save size={20} />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
