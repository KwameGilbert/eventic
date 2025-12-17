import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    FileText,
    Image as ImageIcon,
    Upload,
    X,
    CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import awardService from '../../services/awardService';
import { showSuccess, showError } from '../../utils/toast';

const CreateAward = () => {
    const navigate = useNavigate();

    // Loading states
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Award form state
    const [awardData, setAwardData] = useState({
        title: '',
        description: '',
        ceremonyDate: '',
        ceremonyTime: '',
        votingStart: '',
        votingEnd: '',
        venueName: '',
        address: '',
        city: '',
        region: '',
        country: '',
        mapUrl: '',
        bannerImage: null,
        bannerImagePreview: '',
        videoUrl: '',
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        phone: '',
        showResults: true
    });

    // Countries (static for now)
    const countries = [
        'Ghana', 'Nigeria', 'Kenya', 'South Africa',
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
        'France', 'Spain', 'Italy', 'Netherlands', 'India', 'Japan', 'China', 'Brazil', 'Mexico', 'Other'
    ];

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAwardData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle banner image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAwardData(prev => ({
                    ...prev,
                    bannerImage: file,
                    bannerImagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove banner image
    const removeBannerImage = () => {
        setAwardData(prev => ({ ...prev, bannerImage: null, bannerImagePreview: '' }));
    };

    // Handle form submit
    const handleSubmit = async (status = 'draft') => {
        setIsSubmitting(true);

        try {
            // Combine date and time for ceremony
            const ceremonyDateTime = awardData.ceremonyDate && awardData.ceremonyTime
                ? `${awardData.ceremonyDate}T${awardData.ceremonyTime}:00`
                : null;

            // Prepare award data for API
            const formData = new FormData();
            formData.append('title', awardData.title);
            formData.append('description', awardData.description || '');
            formData.append('ceremony_date', ceremonyDateTime || '');
            formData.append('voting_start', awardData.votingStart || '');
            formData.append('voting_end', awardData.votingEnd || '');
            formData.append('venue_name', awardData.venueName || '');
            formData.append('address', awardData.address || '');
            formData.append('city', awardData.city || '');
            formData.append('region', awardData.region || '');
            formData.append('country', awardData.country || '');
            formData.append('map_url', awardData.mapUrl || '');
            formData.append('video_url', awardData.videoUrl || '');
            formData.append('website', awardData.website || '');
            formData.append('facebook', awardData.facebook || '');
            formData.append('twitter', awardData.twitter || '');
            formData.append('instagram', awardData.instagram || '');
            formData.append('phone', awardData.phone || '');
            formData.append('show_results', awardData.showResults ? '1' : '0');
            formData.append('status', status);

            // Add banner image if available
            if (awardData.bannerImage) {
                formData.append('banner_image', awardData.bannerImage);
            }

            const response = await awardService.create(formData);

            if (response.success) {
                showSuccess('Award created successfully!');
                // Redirect to awards page
                setTimeout(() => {
                    if (response.data?.id) {
                        navigate(`/organizer/awards/${response.data.id}`);
                    } else {
                        navigate('/organizer/awards');
                    }
                }, 1000);
            } else {
                showError(response.message || 'Failed to create award');
            }
        } catch (err) {
            showError(err.message || 'An error occurred while creating the award');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Save as draft handler
    const handleSaveAsDraft = (e) => {
        e.preventDefault();
        handleSubmit('draft');
    };

    // Submit for review handler (pending status)
    const handleSubmitForReview = (e) => {
        e.preventDefault();
        handleSubmit('pending');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/organizer/awards')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Award</h1>
                    <p className="text-gray-500 mt-1">Fill in the details to create your award</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Award Details */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Award Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={awardData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="e.g., Ghana Music Awards 2025"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={awardData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Describe your award ceremony..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dates & Timing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dates & Timing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ceremony Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="ceremonyDate"
                                            value={awardData.ceremonyDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ceremony Time
                                        </label>
                                        <input
                                            type="time"
                                            name="ceremonyTime"
                                            value={awardData.ceremonyTime}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Voting Start Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="votingStart"
                                            value={awardData.votingStart}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Voting End Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="votingEnd"
                                            value={awardData.votingEnd}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Venue & Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Venue & Location</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Venue Name
                                    </label>
                                    <input
                                        type="text"
                                        name="venueName"
                                        value={awardData.venueName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="e.g., National Theatre"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={awardData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="e.g., Liberation Road"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={awardData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="e.g., Accra"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Region/State
                                        </label>
                                        <input
                                            type="text"
                                            name="region"
                                            value={awardData.region}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="e.g., Greater Accra"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country
                                        </label>
                                        <select
                                            name="country"
                                            value={awardData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Google Maps URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        name="mapUrl"
                                        value={awardData.mapUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="https://maps.google.com/..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Banner Image
                                    </label>
                                    {awardData.bannerImagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={awardData.bannerImagePreview}
                                                alt="Banner preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeBannerImage}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="banner-upload"
                                            />
                                            <label
                                                htmlFor="banner-upload"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-600">Click to upload banner image</span>
                                                <span className="text-xs text-gray-400 mt-1">Recommended: 1200x600px</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Video URL (YouTube/Vimeo)
                                    </label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        value={awardData.videoUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact & Social */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Social Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={awardData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="+233 20 000 0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={awardData.website}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Facebook Page
                                    </label>
                                    <input
                                        type="url"
                                        name="facebook"
                                        value={awardData.facebook}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Twitter/X Handle
                                    </label>
                                    <input
                                        type="url"
                                        name="twitter"
                                        value={awardData.twitter}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Instagram Profile
                                    </label>
                                    <input
                                        type="url"
                                        name="instagram"
                                        value={awardData.instagram}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="showResults"
                                        checked={awardData.showResults}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        id="show-results"
                                    />
                                    <label htmlFor="show-results" className="text-sm text-gray-700">
                                        Show voting results publicly
                                    </label>
                                </div>

                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Preview & Actions */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Preview Card */}
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {awardData.bannerImagePreview ? (
                                    <img
                                        src={awardData.bannerImagePreview}
                                        alt="Award preview"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {awardData.title || 'Award Title'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {awardData.ceremonyDate ? new Date(awardData.ceremonyDate).toLocaleDateString() : 'No date set'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {awardData.venueName || 'No venue'}
                                    </p>
                                </div>

                                {awardData.description && (
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {awardData.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSaveAsDraft}
                                className="w-full gap-2"
                                disabled={isSubmitting || !awardData.title}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FileText size={16} />
                                        Save as Draft
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleSubmitForReview}
                                className="w-full gap-2"
                                disabled={isSubmitting || !awardData.title || !awardData.ceremonyDate}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} />
                                        Submit for Review
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-gray-500 text-center">
                                * Title and ceremony date are required
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateAward;
