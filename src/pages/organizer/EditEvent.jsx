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
    Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import PageLoader from '../../components/ui/PageLoader';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    // Event form state
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        category: '',
        date: '',
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

    // Categories
    const categories = [
        'Music', 'Technology', 'Business', 'Sports', 'Art',
        'Food & Drink', 'Health & Wellness', 'Fashion', 'Education', 'Other'
    ];

    // Countries
    const countries = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
        'France', 'Spain', 'Italy', 'Netherlands', 'Ghana', 'Nigeria', 'Kenya',
        'South Africa', 'India', 'Japan', 'China', 'Brazil', 'Mexico', 'Other'
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

    // Status options
    const statusOptions = [
        'Draft',
        'Published',
        'Cancelled'
    ];

    // Load event data
    useEffect(() => {
        // Simulate API call to fetch event data
        const mockEvent = {
            id: parseInt(id),
            name: 'Summer Music Festival 2024',
            description: 'Join us for the biggest music festival of the summer! Featuring top artists from around the world, delicious food vendors, and an unforgettable atmosphere.',
            category: 'Music',
            audience: 'Everyone',
            status: 'Published',
            date: '2024-06-15',
            startTime: '18:00',
            endTime: '23:00',
            venue: 'Central Park Amphitheater',
            address: '123 Park Avenue',
            city: 'New York',
            country: 'United States',
            mapsUrl: 'https://maps.google.com/?q=Central+Park',
            mainImagePreview: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
            videoUrl: 'https://youtube.com/watch?v=example',
            website: 'https://summerfest2024.com',
            facebook: 'https://facebook.com/summerfest',
            twitter: 'https://twitter.com/summerfest',
            instagram: 'https://instagram.com/summerfest',
            phone: '+1 234 567 8900',
        };

        const mockTags = ['music', 'festival', 'summer', 'outdoor', 'live'];

        const mockPhotos = [
            { id: 1, preview: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=200&fit=crop' },
            { id: 2, preview: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop' },
        ];

        const mockTickets = [
            { id: 1, name: 'General Admission', price: '59', promoPrice: '49', saleStartDate: '2024-05-01', saleEndDate: '2024-05-15', quantity: '500', maxPerOrder: '10', description: 'Standard entry ticket' },
            { id: 2, name: 'VIP Pass', price: '150', promoPrice: '', saleStartDate: '', saleEndDate: '', quantity: '100', maxPerOrder: '4', description: 'VIP access with exclusive perks' },
        ];

        setTimeout(() => {
            setEventData(mockEvent);
            setTags(mockTags);
            setEventPhotos(mockPhotos);
            setTickets(mockTickets);
            setIsLoading(false);
        }, 500);
    }, [id]);

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
        const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
        setTickets(prev => [...prev, { id: newId, name: '', price: '', promoPrice: '', saleStartDate: '', saleEndDate: '', quantity: '', maxPerOrder: '', description: '' }]);
    };

    // Remove ticket
    const removeTicket = (id) => {
        if (tickets.length > 1) {
            setTickets(prev => prev.filter(ticket => ticket.id !== id));
        }
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Event Data:', eventData);
        console.log('Tags:', tags);
        console.log('Photos:', eventPhotos);
        console.log('Tickets:', tickets);
        // Navigate back to event view
        navigate(`/organizer/events/${id}`);
    };

    // Calculate total tickets
    const totalTickets = tickets.reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0);

    if (isLoading) {
        return <PageLoader message="Loading event data..." fullScreen={false} />;
    }

    return (
        <div className="space-y-6">
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
                        variant="outline"
                        onClick={() => navigate(`/organizer/events/${id}`)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2">
                        <Save size={16} />
                        Save Changes
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Event Details */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Event Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    {statusOptions.map((status) => (
                                        <label
                                            key={status}
                                            className={`
                                                flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all
                                                ${eventData.status === status
                                                    ? 'border-(--brand-primary) bg-(--brand-primary)/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status}
                                                checked={eventData.status === status}
                                                onChange={handleEventChange}
                                                className="sr-only"
                                            />
                                            <span className={`font-medium ${eventData.status === status ? 'text-(--brand-primary)' : 'text-gray-700'}`}>
                                                {status}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

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
                                            >
                                                <option value="">Select category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Event Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={eventData.date}
                                            onChange={handleEventChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            required
                                        />
                                    </div>
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
                                            placeholder="New York"
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
                                        Main Event Image *
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
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleMainImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact & Social Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Globe size={20} className="text-(--brand-primary)" />
                                    Contact & Social Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            <span className="flex items-center gap-2">
                                                <Phone size={14} />
                                                Contact Number
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={eventData.phone}
                                            onChange={handleEventChange}
                                            placeholder="+1 234 567 8900"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            <span className="flex items-center gap-2">
                                                <Globe size={14} />
                                                Website
                                            </span>
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={eventData.website}
                                            onChange={handleEventChange}
                                            placeholder="https://www.example.com"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            <span className="flex items-center gap-2">
                                                <Facebook size={14} />
                                                Facebook
                                            </span>
                                        </label>
                                        <input
                                            type="url"
                                            name="facebook"
                                            value={eventData.facebook}
                                            onChange={handleEventChange}
                                            placeholder="facebook.com/event"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            <span className="flex items-center gap-2">
                                                <Twitter size={14} />
                                                Twitter / X
                                            </span>
                                        </label>
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={eventData.twitter}
                                            onChange={handleEventChange}
                                            placeholder="x.com/event"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            <span className="flex items-center gap-2">
                                                <Instagram size={14} />
                                                Instagram
                                            </span>
                                        </label>
                                        <input
                                            type="url"
                                            name="instagram"
                                            value={eventData.instagram}
                                            onChange={handleEventChange}
                                            placeholder="instagram.com/event"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
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
                                            <Badge variant="secondary">Ticket {index + 1}</Badge>
                                            {tickets.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTicket(ticket.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                                                    Price ($) *
                                                </label>
                                                <div className="relative">
                                                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={ticket.price}
                                                        onChange={(e) => handleTicketChange(ticket.id, 'price', e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
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
                                                        Promo Price ($)
                                                    </label>
                                                    <div className="relative">
                                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={ticket.promoPrice}
                                                            onChange={(e) => handleTicketChange(ticket.id, 'promoPrice', e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Sale Starts
                                                    </label>
                                                    <input
                                                        type="date"
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
                                                        type="date"
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
                                        <Badge variant={eventData.status === 'Published' ? 'success' : 'secondary'}>
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
                            <Button onClick={handleSubmit} className="w-full gap-2">
                                <Save size={16} />
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate(`/organizer/events/${id}`)}
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
