import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Image,
    Plus,
    Trash2,
    DollarSign,
    Users,
    Tag,
    FileText,
    ChevronDown,
    Upload,
    X,
    Globe,
    Phone,
    Video,
    Facebook,
    Instagram,
    Twitter,
    Map,
    Images,
    Save,
    Loader2,
    AlertTriangle,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import PageLoader from '../../components/ui/PageLoader';
import organizerService from '../../services/organizerService';
import eventService from '../../services/eventService';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [loadError, setLoadError] = useState(null);

    // Track deleted tickets for API call
    const [deletedTicketIds, setDeletedTicketIds] = useState([]);

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
        status: ''
    });

    // Tags state
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Event photos state
    const [eventPhotos, setEventPhotos] = useState([]);

    // Tickets state
    const [tickets, setTickets] = useState([]);

    // Categories - fetched from API
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Fallback categories
    const fallbackCategories = [
        { id: 1, name: 'Music' },
        { id: 2, name: 'Technology' },
        { id: 3, name: 'Business' },
        { id: 4, name: 'Sports' },
        { id: 5, name: 'Art' },
        { id: 6, name: 'Food & Drink' },
        { id: 7, name: 'Health & Wellness' },
        { id: 8, name: 'Fashion' },
        { id: 9, name: 'Education' },
        { id: 10, name: 'Other' }
    ];

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
                const response = await eventService.getEventTypes();
                if (response.success && response.data?.event_types) {
                    setCategories(response.data.event_types);
                } else {
                    setCategories(fallbackCategories);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setCategories(fallbackCategories);
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
                        name: event.name || '',
                        description: event.description || '',
                        category: event.category || '',
                        categoryId: event.categoryId || null,
                        startDate: event.start_time ? event.start_time.split('T')[0] : '',
                        endDate: event.end_time ? event.end_time.split('T')[0] : '',
                        startTime: event.start_time ? event.start_time.split('T')[1].substring(0, 5) : '',
                        endTime: event.end_time ? event.end_time.split('T')[1].substring(0, 5) : '',
                        venue: event.venue || '',
                        address: event.address || '',
                        city: event.city || '',
                        country: event.country || '',
                        mapsUrl: event.mapsUrl || '',
                        mainImage: null,
                        mainImagePreview: event.mainImage || '',
                        videoUrl: event.videoUrl || '',
                        website: event.website || '',
                        facebook: event.facebook || '',
                        twitter: event.twitter || '',
                        instagram: event.instagram || '',
                        phone: event.phone || '',
                        audience: event.audience || 'Everyone',
                        status: event.status?.toLowerCase() || 'draft'
                    });

                    setTags(event.tags || []);

                    // Map photos
                    if (event.photos && event.photos.length > 0) {
                        setEventPhotos(event.photos.map((url, index) => ({
                            id: index + 1,
                            preview: url,
                            isExisting: true
                        })));
                    }

                    // Map tickets from API
                    if (event.tickets && event.tickets.length > 0) {
                        setTickets(event.tickets.map(ticket => ({
                            id: ticket.id,
                            name: ticket.name || '',
                            price: ticket.price?.toString() || '',
                            promoPrice: ticket.promoPrice?.toString() || '',
                            saleStartDate: ticket.saleStartDate ? ticket.saleStartDate.slice(0, 16) : '',
                            saleEndDate: ticket.saleEndDate ? ticket.saleEndDate.slice(0, 16) : '',
                            quantity: ticket.quantity?.toString() || '',
                            maxPerOrder: ticket.maxPerOrder?.toString() || '10',
                            description: ticket.description || '',
                            sold: ticket.sold || 0
                        })));
                    } else {
                        // Add empty ticket if none exist
                        setTickets([{
                            id: 'new-1',
                            name: '',
                            price: '',
                            promoPrice: '',
                            saleStartDate: '',
                            saleEndDate: '',
                            quantity: '',
                            maxPerOrder: '10',
                            description: ''
                        }]);
                    }
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
    const removeEventPhoto = (photoId) => {
        setEventPhotos(prev => prev.filter(photo => photo.id !== photoId));
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
    const handleTicketChange = (ticketId, field, value) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
        ));
    };

    // Add new ticket
    const addTicket = () => {
        const newId = `new-${Date.now()}`;
        setTickets(prev => [...prev, {
            id: newId,
            name: '',
            price: '',
            promoPrice: '',
            saleStartDate: '',
            saleEndDate: '',
            quantity: '',
            maxPerOrder: '10',
            description: ''
        }]);
    };

    // Remove ticket
    const removeTicket = (ticketId) => {
        if (tickets.length > 1) {
            // If it's an existing ticket (numeric ID), track for deletion
            if (typeof ticketId === 'number') {
                const ticketToDelete = tickets.find(t => t.id === ticketId);
                if (ticketToDelete && ticketToDelete.sold > 0) {
                    alert('Cannot delete a ticket type with sold tickets.');
                    return;
                }
                setDeletedTicketIds(prev => [...prev, ticketId]);
            }
            setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        }
    };

    // Handle form submit with specified status
    const handleSubmit = async (status = null) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);

            // Build event data for API
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
                address: [eventData.address, eventData.city, eventData.country].filter(Boolean).join(', '),
                event_type_id: eventData.categoryId || categories.find(c => c.name === eventData.category)?.id,
                status: status || eventData.status, // Use passed status or current status
                audience: eventData.audience,
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
            const validTickets = tickets.filter(t => t.name && t.quantity);

            // Get the banner image if it's a new file (File object, not a URL string)
            const bannerImage = eventData.mainImage instanceof File ? eventData.mainImage : null;

            // Filter only new event photos (those with file property, not existing URLs)
            const newEventPhotos = eventPhotos.filter(photo => photo.file);

            // Call the update service
            const response = await eventService.updateWithTickets(
                id,
                apiEventData,
                validTickets,
                deletedTicketIds,
                bannerImage, // Pass the banner image file if available
                newEventPhotos // Pass new event photos
            );

            if (response.success) {
                setSubmitSuccess(true);
                // Clear deleted tickets tracking
                setDeletedTicketIds([]);
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

    // Calculate total tickets
    const totalTickets = tickets.reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0);

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

            <form>
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Event Details */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText size={20} className="text-(--brand-primary)" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Event Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={eventData.name}
                                        onChange={handleEventChange}
                                        placeholder="Enter event name"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={eventData.description}
                                        onChange={handleEventChange}
                                        placeholder="Describe your event..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) resize-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Category *
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                value={eventData.category}
                                                onChange={handleEventChange}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                                required
                                                disabled={categoriesLoading}
                                            >
                                                <option value="">Select category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Audience *
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="audience"
                                                value={eventData.audience}
                                                onChange={handleEventChange}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                                required
                                            >
                                                <option value="">Select audience</option>
                                                {audienceOptions.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[46px]">
                                        {tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </Badge>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            onBlur={addTag}
                                            placeholder={tags.length === 0 ? "Type and press Enter to add tags" : "Add more..."}
                                            className="flex-1 min-w-[120px] border-none outline-none text-sm bg-transparent"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Date & Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar size={20} className="text-(--brand-primary)" />
                                    Date & Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={eventData.startDate}
                                            onChange={handleEventChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            End Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={eventData.endDate}
                                            onChange={handleEventChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Start Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={eventData.startTime}
                                            onChange={handleEventChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            End Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={eventData.endTime}
                                            onChange={handleEventChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MapPin size={20} className="text-(--brand-primary)" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Venue Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={eventData.venue}
                                        onChange={handleEventChange}
                                        placeholder="e.g. Central Park Amphitheater"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={eventData.address}
                                        onChange={handleEventChange}
                                        placeholder="123 Main Street"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={eventData.city}
                                            onChange={handleEventChange}
                                            placeholder="Accra"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Country *
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="country"
                                                value={eventData.country}
                                                onChange={handleEventChange}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                                required
                                            >
                                                <option value="">Select country</option>
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>{country}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <span className="flex items-center gap-2">
                                            <Map size={14} />
                                            Google Maps URL
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        name="mapsUrl"
                                        value={eventData.mapsUrl}
                                        onChange={handleEventChange}
                                        placeholder="https://maps.google.com/..."
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Images size={20} className="text-(--brand-primary)" />
                                    Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Main Event Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Main Event Image
                                    </label>
                                    {eventData.mainImagePreview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={eventData.mainImagePreview}
                                                alt="Main event"
                                                className="w-full max-w-md h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeMainImage}
                                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                            >
                                                <X size={16} className="text-gray-600" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-(--brand-primary) hover:bg-gray-50 transition-colors">
                                            <Upload size={32} className="text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload main image</span>
                                            <span className="text-xs text-gray-400 mt-1">This will be the featured image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleMainImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">Note: Image upload is optional for now</p>
                                </div>

                                {/* Video URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <span className="flex items-center gap-2">
                                            <Video size={14} />
                                            Event Video URL
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        value={eventData.videoUrl}
                                        onChange={handleEventChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">YouTube or Vimeo link</p>
                                </div>

                                {/* Additional Photos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Additional Event Photos
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {eventPhotos.map((photo) => (
                                            <div key={photo.id} className="relative group">
                                                <img
                                                    src={photo.preview}
                                                    alt="Event"
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeEventPhoto(photo.id)}
                                                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} className="text-gray-600" />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-(--brand-primary) hover:bg-gray-50 transition-colors">
                                            <Plus size={24} className="text-gray-400" />
                                            <span className="text-xs text-gray-400 mt-1">Add Photo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handlePhotosUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Globe size={20} className="text-(--brand-primary)" />
                                    Additional Information (Optional)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="website"
                                            value={eventData.website}
                                            onChange={handleEventChange}
                                            placeholder="https://example.com"
                                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Facebook
                                        </label>
                                        <div className="relative">
                                            <Facebook size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="facebook"
                                                value={eventData.facebook}
                                                onChange={handleEventChange}
                                                placeholder="Facebook profile URL"
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Twitter
                                        </label>
                                        <div className="relative">
                                            <Twitter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="twitter"
                                                value={eventData.twitter}
                                                onChange={handleEventChange}
                                                placeholder="Twitter profile URL"
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Instagram
                                        </label>
                                        <div className="relative">
                                            <Instagram size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="instagram"
                                                value={eventData.instagram}
                                                onChange={handleEventChange}
                                                placeholder="Instagram profile URL"
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={eventData.phone}
                                                onChange={handleEventChange}
                                                placeholder="+233 20 123 4567"
                                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tickets */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Tag size={20} className="text-(--brand-primary)" />
                                        Ticket Types
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addTicket}
                                        className="gap-1"
                                    >
                                        <Plus size={16} />
                                        Add Ticket
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {tickets.map((ticket, index) => (
                                    <div
                                        key={ticket.id}
                                        className="p-4 border border-gray-200 rounded-lg space-y-4 relative"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">Ticket {index + 1}</Badge>
                                                {ticket.sold > 0 && (
                                                    <Badge variant="info" className="text-xs">
                                                        {ticket.sold} sold
                                                    </Badge>
                                                )}
                                            </div>
                                            {tickets.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTicket(ticket.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title={ticket.sold > 0 ? 'Cannot delete - tickets sold' : 'Delete ticket'}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Ticket Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ticket.name}
                                                    onChange={(e) => handleTicketChange(ticket.id, 'name', e.target.value)}
                                                    placeholder="e.g. VIP, Regular"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Price (GH₵) *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">GH₵</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={ticket.price}
                                                        onChange={(e) => handleTicketChange(ticket.id, 'price', e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Total Quantity *
                                                </label>
                                                <div className="relative">
                                                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={ticket.quantity}
                                                        onChange={(e) => handleTicketChange(ticket.id, 'quantity', e.target.value)}
                                                        placeholder="100"
                                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Max Per Order
                                                </label>
                                                <div className="relative">
                                                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={ticket.maxPerOrder}
                                                        onChange={(e) => handleTicketChange(ticket.id, 'maxPerOrder', e.target.value)}
                                                        placeholder="10"
                                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Promotional Pricing */}
                                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                                            <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
                                                <Tag size={14} />
                                                Promotional Pricing (Optional)
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Promo Price (GH₵)
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">GH₵</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={ticket.promoPrice}
                                                            onChange={(e) => handleTicketChange(ticket.id, 'promoPrice', e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Sale Starts
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={ticket.saleStartDate}
                                                        onChange={(e) => handleTicketChange(ticket.id, 'saleStartDate', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Sale Ends
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={ticket.saleEndDate}
                                                        onChange={(e) => handleTicketChange(ticket.id, 'saleEndDate', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Description (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={ticket.description}
                                                onChange={(e) => handleTicketChange(ticket.id, 'description', e.target.value)}
                                                placeholder="What's included with this ticket?"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Total tickets available:</span>
                                    <span className="font-semibold text-gray-900">{totalTickets}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Event Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {eventData.mainImagePreview ? (
                                    <img
                                        src={eventData.mainImagePreview}
                                        alt="Event preview"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Image size={32} className="text-gray-300" />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Status</span>
                                        <Badge variant={eventData.status === 'published' ? 'success' : eventData.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                            {eventData.status || '—'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Event Name</span>
                                        <span className="text-gray-900 font-medium truncate ml-4 max-w-[150px]">
                                            {eventData.name || '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Category</span>
                                        <span className="text-gray-900 font-medium">
                                            {eventData.category || '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Date</span>
                                        <span className="text-gray-900 font-medium">
                                            {eventData.date || '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Location</span>
                                        <span className="text-gray-900 font-medium truncate ml-4 max-w-[150px]">
                                            {eventData.city && eventData.country
                                                ? `${eventData.city}, ${eventData.country}`
                                                : '—'}
                                        </span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Ticket Types</span>
                                        <span className="text-gray-900 font-medium">{tickets.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Tickets</span>
                                        <span className="text-gray-900 font-medium">{totalTickets}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-3 sticky top-[420px]">
                            {/* If published, show only Save button. Otherwise show Submit for Review and Save as Draft */}
                            {eventData.status?.toLowerCase() === 'published' ? (
                                <Button
                                    type="button"
                                    onClick={handleSaveChanges}
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
                                            <Save size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={handleSaveAsDraft}
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
                                </>
                            )}
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-gray-500 hover:text-gray-700"
                                onClick={() => navigate(`/organizer/events/${id}`)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;
