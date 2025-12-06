import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save, Phone, AlertCircle, Loader2 } from 'lucide-react';
import attendeeService from '../services/attendeeService';
import { showSuccess, showError } from '../utils/toast';
import PageLoader from '../components/ui/PageLoader';

const Settings = () => {
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        bio: '',
        phone: ''
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch current user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await attendeeService.getMyProfile();
                const profileData = response.data?.attendee || response.data || {};

                setFormData({
                    first_name: profileData?.first_name || user?.name?.split(' ')[0] || '',
                    last_name: profileData?.last_name || user?.name?.split(' ').slice(1).join(' ') || '',
                    email: profileData?.email || user?.email || '',
                    bio: profileData?.bio || '',
                    phone: profileData?.phone || ''
                });
                setPreviewImage(profileData?.profile_image || null);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Fall back to user data from auth context
                const nameParts = (user?.name || '').split(' ');
                setFormData({
                    first_name: nameParts[0] || '',
                    last_name: nameParts.slice(1).join(' ') || '',
                    email: user?.email || '',
                    bio: '',
                    phone: ''
                });
            } finally {
                setIsFetching(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('Image size must be less than 5MB');
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload the image
        setIsUploading(true);
        try {
            const response = await attendeeService.uploadProfileImage(file);
            const newImageUrl = response.data?.profile_image || response.data?.attendee?.profile_image;

            if (newImageUrl) {
                setPreviewImage(newImageUrl);
            }
            showSuccess('Profile image updated successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            showError(error.message || 'Failed to upload image');
            // Revert to no image on error
            setPreviewImage(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updateData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                bio: formData.bio
            };

            await attendeeService.updateMyProfile(updateData);
            showSuccess('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showError(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <PageLoader message="Loading your profile..." />;
    }

    const displayName = `${formData.first_name} ${formData.last_name}`.trim() || 'User';
    const avatarUrl = previewImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f97316&color=fff&size=200`;

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
                            <div
                                className="relative group cursor-pointer"
                                onClick={handleImageClick}
                            >
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    {isUploading ? (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-(--brand-primary) animate-spin" />
                                        </div>
                                    ) : (
                                        <img
                                            src={avatarUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 bg-(--brand-primary) text-white p-2 rounded-full shadow-lg hover:bg-(--brand-primary)/90 transition-colors"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <p className="mt-4 text-sm text-gray-500">Click to upload new photo</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <User size={16} />
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none"
                                        placeholder="Enter your first name"
                                        required
                                    />
                                </div>

                                {/* Last Name Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <User size={16} />
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none"
                                        placeholder="Enter your last name"
                                        required
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
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Email cannot be changed
                                    </p>
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Phone size={16} />
                                        Phone Number
                                    </label>
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
                                    maxLength={500}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="Tell us a little about yourself..."
                                />
                                <p className="text-xs text-gray-400">
                                    {formData.bio?.length || 0}/500 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-3 bg-(--brand-primary) text-white rounded-xl font-semibold hover:bg-(--brand-primary)/90 transition-all shadow-lg shadow-(--brand-primary)/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
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
