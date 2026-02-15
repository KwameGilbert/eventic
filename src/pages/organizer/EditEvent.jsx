import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Loader2,
    AlertTriangle,
    AlertCircle,
    CheckCircle,
    FileText
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import PageLoader from '../../components/ui/PageLoader';
import organizerService from '../../services/organizerService';
import eventService from '../../services/eventService';

import BasicInformationSection from '../../components/events/BasicInformationSection';
import DateTimeSection from '../../components/events/DateTimeSection';
import LocationSection from '../../components/events/LocationSection';
import MediaSection from '../../components/events/MediaSection';
import AdditionalInfoSection from '../../components/events/AdditionalInfoSection';
import EventPreviewCard from '../../components/events/EventPreviewCard';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [loadError, setLoadError] = useState(null);

    // Track deleted tickets for API call


    // Event form state
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        category: '',
        categoryId: null,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        address: '',
        city: '',
        region: '',
        country: '',
        mapsUrl: '',
        mainImage: null,
        mainImagePreview: '',
        videoUrl: '',
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        phone: '',
        audience: '',
        language: '',
        status: ''
    });

    // Tags state
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Event photos state (multiple)
    const [eventPhotos, setEventPhotos] = useState([]);

    // Tickets state - removed for independent management
    const [tickets] = useState([]);

    // Categories - fetched from API
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);

    // Countries
    const countries = [
        'Ghana', 'Nigeria', 'Kenya', 'South Africa',
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
        'France', 'Spain', 'Italy', 'Netherlands', 'India', 'Japan', 'China', 'Brazil', 'Mexico', 'Other'
    ];

    // Audience options
    const audienceOptions = [
        'Everyone',
        'Students',
        'Families',
        'Professionals',
        'Members Only',
        'Adults Only (18+)',
        'Adults Only (21+)',
    ];

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                setCategoriesError(null);
                const response = await eventService.getEventTypes();
                if (response.success && response.data?.event_types) {
                    setCategories(response.data.event_types);
                } else {
                    setCategoriesError('Failed to load categories');
                    setCategories([]);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setCategoriesError(err.message || 'Failed to load categories');
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Load event data from API
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setIsLoading(true);
                setLoadError(null);

                const response = await organizerService.getEventDetails(id);

                if (response.success && response.data) {
                    const event = response.data;

                    // Map API data to form state
                    setEventData({
                        name: event.title || '',
                        description: event.description || '',
                        category: event.category || '',
                        categoryId: event.categoryId || null,
                        startDate: event.start_time ? event.start_time.split('T')[0] : '',
                        endDate: event.end_time ? event.end_time.split('T')[0] : '',
                        startTime: event.start_time ? event.start_time.split('T')[1].substring(0, 5) : '',
                        endTime: event.end_time ? event.end_time.split('T')[1].substring(0, 5) : '',
                        venue: event.venue || '',
                        address: event.location || '',
                        city: event.city || '',
                        region: event.region || '',
                        country: event.country || '',
                        mapsUrl: event.mapUrl || '',
                        mainImage: null,
                        mainImagePreview: event.image || '',
                        videoUrl: event.videoUrl || '',
                        website: event.website || '',
                        facebook: event.facebook || '',
                        twitter: event.twitter || '',
                        instagram: event.instagram || '',
                        phone: event.phone || '',
                        audience: event.audience || 'Everyone',
                        language: event.language || '',
                        status: event.status?.toLowerCase() || 'draft'
                    });

                    setTags(event.tags || []);

                    // Map photos
                    if (event.images && event.images.length > 0) {
                        setEventPhotos(event.images.map((url, index) => ({
                            id: index + 1,
                            preview: url,
                            isExisting: true
                        })));
                    }

                    // Tickets are managed separately now
                    // setTickets(event.ticketTypes.map(ticket => ({ ... })));
                } else {
                    setLoadError(response.message || 'Failed to load event data');
                }
            } catch (err) {
                console.error('Error fetching event:', err);
                setLoadError(err.message || 'An error occurred while loading event data');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEventData();
        }
    }, [id]);

    // Handle event data change
    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));

        // If category select changes, also update categoryId
        if (name === 'category') {
            const selectedCat = categories.find(c => c.name === value);
            setEventData(prev => ({
                ...prev,
                [name]: value,
                categoryId: selectedCat?.id || null
            }));
        }
    };

    // Handle main image upload
    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventData(prev => ({
                    ...prev,
                    mainImage: file,
                    mainImagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove main image
    const removeMainImage = () => {
        setEventData(prev => ({ ...prev, mainImage: null, mainImagePreview: '' }));
    };

    // Handle tag input
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const trimmedTag = tagInput.trim().replace(',', '');
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags(prev => [...prev, trimmedTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };



    // Handle form submit with specified status
    const handleSubmit = async (status = null) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);

            // Build event data for API
            const startDateTime = eventData.startDate && eventData.startTime
                ? `${eventData.startDate}T${eventData.startTime}:00`
                : null;
            const endDateTime = eventData.endDate && eventData.endTime
                ? `${eventData.endDate}T${eventData.endTime}:00`
                : null;

            const apiEventData = {
                title: eventData.name,
                description: eventData.description,
                start_time: startDateTime,
                end_time: endDateTime,
                venue_name: eventData.venue,
                address: eventData.address,
                city: eventData.city,
                region: eventData.region,
                country: eventData.country,
                event_type_id: eventData.categoryId || categories.find(c => c.name === eventData.category)?.id,
                status: status || eventData.status, // Use passed status or current status
                audience: eventData.audience,
                language: eventData.language || null,
                tags: tags,
                map_url: eventData.mapsUrl,
                website: eventData.website || null,
                facebook: eventData.facebook || null,
                twitter: eventData.twitter || null,
                instagram: eventData.instagram || null,
                phone: eventData.phone || null,
                video_url: eventData.videoUrl || null,
            };

            // Filter valid tickets


            // Get the banner image if it's a new file (File object, not a URL string)
            const bannerImage = eventData.mainImage instanceof File ? eventData.mainImage : null;

            // Filter only new event photos (those with file property, not existing URLs)
            const newEventPhotos = eventPhotos.filter(photo => photo.file);

            // Call the update service with no tickets
            const response = await eventService.updateWithTickets(
                id,
                apiEventData,
                [], // No tickets update here
                [], // No deleted tickets here
                bannerImage, // Pass the banner image file if available
                newEventPhotos // Pass new event photos
            );

            if (response.success) {
                setSubmitSuccess(true);
                // Clear deleted tickets tracking - removed
                // Navigate back after delay
                setTimeout(() => {
                    navigate(`/organizer/events/${id}`);
                }, 1500);
            } else {
                setSubmitError(response.message || 'Failed to update event');
            }
        } catch (err) {
            console.error('Error updating event:', err);
            setSubmitError(err.message || 'An error occurred while updating the event');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Save as draft handler
    const handleSaveAsDraft = (e) => {
        if (e) e.preventDefault();
        handleSubmit('draft');
    };

    // Submit for review handler (pending status)
    const handleSubmitForReview = (e) => {
        if (e) e.preventDefault();
        handleSubmit('pending');
    };

    // Save current changes without changing status
    const handleSaveChanges = (e) => {
        if (e) e.preventDefault();
        handleSubmit(null);
    };

    if (isLoading) {
        return <PageLoader message="Loading event data..." fullScreen={false} />;
    }

    if (loadError) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Event</h3>
                        <p className="text-gray-500 mb-4">{loadError}</p>
                        <Button onClick={() => navigate('/organizer/events')}>
                            Back to Events
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success Alert */}
            {submitSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Event updated successfully! Redirecting...</span>
                </div>
            )}

            {/* Error Alert */}
            {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{submitError}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/organizer/events/${id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
                        <p className="text-gray-500 mt-1">Update your event details</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(`/organizer/events/${id}`)}
                        disabled={isSubmitting}
                        className="text-gray-500"
                    >
                        Cancel
                    </Button>

                    {/* If published, show only Save button. Otherwise show Save as Draft and Submit for Review */}
                    {eventData.status?.toLowerCase() === 'published' ? (
                        <Button onClick={handleSaveChanges} className="gap-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSaveAsDraft}
                                className="gap-2"
                                disabled={isSubmitting}
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
                            <Button onClick={handleSubmitForReview} className="gap-2" disabled={isSubmitting}>
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
                        </>
                    )}
                </div>
            </div>

            {/* Form */}
            <form>
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Event Details */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        <BasicInformationSection
                            eventData={eventData}
                            categories={categories}
                            audienceOptions={audienceOptions}
                            tags={tags}
                            tagInput={tagInput}
                            isLoadingCategories={categoriesLoading}
                            categoriesError={categoriesError}
                            handleEventChange={handleEventChange}
                            setTagInput={setTagInput}
                            handleTagKeyDown={handleTagKeyDown}
                            addTag={addTag}
                            removeTag={removeTag}
                        />

                        <DateTimeSection
                            eventData={eventData}
                            handleEventChange={handleEventChange}
                        />

                        <LocationSection
                            eventData={eventData}
                            countries={countries}
                            handleEventChange={handleEventChange}
                        />

                        <MediaSection
                            eventData={eventData}
                            handleEventChange={handleEventChange}
                            handleMainImageUpload={handleMainImageUpload}
                            removeMainImage={removeMainImage}
                        />

                        <AdditionalInfoSection
                            eventData={eventData}
                            handleEventChange={handleEventChange}
                        />
                    </div>

                    {/* Right Column - Preview */}
                    <div className="col-span-12 lg:col-span-4">
                        <EventPreviewCard
                            eventData={eventData}
                            categories={categories}
                            tags={tags}
                            eventPhotos={eventPhotos}
                            tickets={tickets}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;
