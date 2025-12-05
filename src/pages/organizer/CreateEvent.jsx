import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
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
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const CreateEvent = () => {
    const navigate = useNavigate();

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
        image: null,
        imagePreview: ''
    });

    // Tickets state
    const [tickets, setTickets] = useState([
        { id: 1, name: '', price: '', quantity: '', description: '' }
    ]);

    // Categories
    const categories = [
        'Music', 'Technology', 'Business', 'Sports', 'Art',
        'Food & Drink', 'Health & Wellness', 'Fashion', 'Education', 'Other'
    ];

    // Handle event data change
    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const removeImage = () => {
        setEventData(prev => ({ ...prev, image: null, imagePreview: '' }));
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
        setTickets(prev => [...prev, { id: newId, name: '', price: '', quantity: '', description: '' }]);
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
        // Here you would submit to API
        console.log('Event Data:', eventData);
        console.log('Tickets:', tickets);
        // Navigate back to events
        navigate('/organizer/events');
    };

    // Calculate total tickets
    const totalTickets = tickets.reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0);

    return (
        <div className="space-y-6">
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

            <form onSubmit={handleSubmit}>
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
                                {/* Event Name */}
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

                                {/* Description */}
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

                                {/* Category */}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={eventData.city}
                                            onChange={handleEventChange}
                                            placeholder="New York, NY"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            required
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
                                        {/* Ticket Header */}
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

                                        {/* Ticket Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Ticket Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ticket.name}
                                                    onChange={(e) => handleTicketChange(ticket.id, 'name', e.target.value)}
                                                    placeholder="e.g. VIP, Regular, Early Bird"
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
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Quantity *
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
                                        </div>

                                        {/* Ticket Description */}
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

                                {/* Total Tickets Summary */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Total tickets available:</span>
                                    <span className="font-semibold text-gray-900">{totalTickets}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Image & Actions */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Event Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Image size={20} className="text-(--brand-primary)" />
                                    Event Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {eventData.imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={eventData.imagePreview}
                                            alt="Event preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <X size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-(--brand-primary) hover:bg-gray-50 transition-colors">
                                        <Upload size={32} className="text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload image</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </CardContent>
                        </Card>

                        {/* Event Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Event Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
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
                                    <span className="text-gray-500">Time</span>
                                    <span className="text-gray-900 font-medium">
                                        {eventData.startTime && eventData.endTime
                                            ? `${eventData.startTime} - ${eventData.endTime}`
                                            : '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Location</span>
                                    <span className="text-gray-900 font-medium truncate ml-4 max-w-[150px]">
                                        {eventData.city || '—'}
                                    </span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Ticket Types</span>
                                    <span className="text-gray-900 font-medium">{tickets.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Tickets</span>
                                    <span className="text-gray-900 font-medium">{totalTickets}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button type="submit" className="w-full gap-2">
                                Create Event
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/organizer/events')}
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

export default CreateEvent;
