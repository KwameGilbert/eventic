import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    AlertTriangle,
    CheckCircle,
    FileText
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import eventService from '../../services/eventService';

// Import new modular components
import BasicInformationSection from '../../components/events/BasicInformationSection';
import DateTimeSection from '../../components/events/DateTimeSection';
import LocationSection from '../../components/events/LocationSection';
import MediaSection from '../../components/events/MediaSection';
import AdditionalInfoSection from '../../components/events/AdditionalInfoSection';
import TicketsSection from '../../components/events/TicketsSection';
import EventPreviewCard from '../../components/events/EventPreviewCard';

const CreateEvent = () => {
    const navigate = useNavigate();

    // Loading and error states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);

    // Categories from API
    const [categories, setCategories] = useState([]);

    // Event form state
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        category: '',
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
        language: ''
    });

    // Tags state
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Event photos state (multiple)
    const [eventPhotos, setEventPhotos] = useState([]);

    // Tickets state
    const [tickets, setTickets] = useState([
        {
            id: 1,
            name: '',
            price: '',
            promoPrice: '',
            saleStartDate: '',
            saleEndDate: '',
            quantity: '',
            maxPerOrder: '',
            description: '',
            ticketImage: null,
            ticketImagePreview: ''
        }
    ]);

    // Countries (static for now)
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

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
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
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Handle event data change
    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
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

    // Handle event photos upload
    const handlePhotosUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventPhotos(prev => [...prev, { file, preview: reader.result, id: Date.now() + Math.random() }]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Remove event photo
    const removeEventPhoto = (id) => {
        setEventPhotos(prev => prev.filter(photo => photo.id !== id));
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

    // Handle ticket change
    const handleTicketChange = (id, field, value) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, [field]: value } : ticket
        ));
    };

    // Add new ticket
    const addTicket = () => {
        const newId = Math.max(...tickets.map(t => t.id)) + 1;
        setTickets(prev => [...prev, {
            id: newId,
            name: '',
            price: '',
            promoPrice: '',
            saleStartDate: '',
            saleEndDate: '',
            quantity: '',
            maxPerOrder: '',
            description: '',
            ticketImage: null,
            ticketImagePreview: ''
        }]);
    };

    // Remove ticket
    const removeTicket = (id) => {
        if (tickets.length > 1) {
            setTickets(prev => prev.filter(ticket => ticket.id !== id));
        }
    };

    // Handle ticket image upload
    const handleTicketImageUpload = (ticketId, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTickets(prev => prev.map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, ticketImage: file, ticketImagePreview: reader.result }
                        : ticket
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove ticket image
    const removeTicketImage = (ticketId) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === ticketId
                ? { ...ticket, ticketImage: null, ticketImagePreview: '' }
                : ticket
        ));
    };

    // Calculate total tickets
    const totalTickets = tickets.reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0);

    // Handle form submit with specified status
    const handleSubmit = async (status = 'draft') => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Find the selected category
            const selectedCategory = categories.find(c => c.name === eventData.category || c.id.toString() === eventData.category);

            // Combine date and time for backend
            const startDateTime = eventData.startDate && eventData.startTime
                ? `${eventData.startDate}T${eventData.startTime}:00`
                : null;
            const endDateTime = eventData.endDate && eventData.endTime
                ? `${eventData.endDate}T${eventData.endTime}:00`
                : null;

            // Prepare event data for API
            const apiEventData = {
                title: eventData.name,
                description: eventData.description,
                event_type_id: selectedCategory?.id || null,
                venue_name: eventData.venue,
                address: eventData.address,
                city: eventData.city,
                region: eventData.region,
                country: eventData.country,
                map_url: eventData.mapsUrl || null,
                start_time: startDateTime,
                end_time: endDateTime,
                audience: eventData.audience,
                language: eventData.language || null,
                tags: tags,
                status: status, // Use the status parameter (draft or pending)
                website: eventData.website || null,
                facebook: eventData.facebook || null,
                twitter: eventData.twitter || null,
                instagram: eventData.instagram || null,
                phone: eventData.phone || null,
                video_url: eventData.videoUrl || null,
            };

            // Filter out valid tickets (with name and quantity)
            const validTickets = tickets.filter(t => t.name && t.quantity);

            // Create event with tickets, passing banner image and event photos if available
            const response = await eventService.createWithTickets(
                apiEventData,
                validTickets,
                eventData.mainImage, // Pass the banner image file
                eventPhotos // Pass the event photos array
            );

            if (response.success) {
                setSubmitSuccess(true);
                // Redirect to events page after a short delay
                setTimeout(() => {
                    navigate('/organizer/events');
                }, 1500);
            } else {
                setSubmitError(response.message || 'Failed to create event');
            }
        } catch (err) {
            setSubmitError(err.message || 'An error occurred while creating the event');
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
            {/* Success Alert */}
            {submitSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Event created successfully! Redirecting...</span>
                </div>
            )}

            {/* Error Alert */}
            {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{submitError}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/organizer/events')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                    <p className="text-gray-500 mt-1">Fill in the details to create your event</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Event Details */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        <BasicInformationSection
                            eventData={eventData}
                            categories={categories}
                            audienceOptions={audienceOptions}
                            tags={tags}
                            tagInput={tagInput}
                            isLoadingCategories={isLoadingCategories}
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

                        <TicketsSection
                            tickets={tickets}
                            handleTicketChange={handleTicketChange}
                            handleTicketImageUpload={handleTicketImageUpload}
                            removeTicketImage={removeTicketImage}
                            addTicket={addTicket}
                            removeTicket={removeTicket}
                            totalTickets={totalTickets}
                        />

                    </div>

                    {/* Right Column - Preview & Actions */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">

                        <EventPreviewCard
                            eventData={eventData}
                            categories={categories}
                            tags={tags}
                            eventPhotos={eventPhotos}
                            tickets={tickets}
                        />

                        {/* Action Buttons */}
                        <div className="space-y-3 sticky top-[420px]">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSaveAsDraft}
                                className="w-full gap-2"
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
                            <Button
                                onClick={handleSubmitForReview}
                                className="w-full gap-2"
                                disabled={isSubmitting}
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
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
