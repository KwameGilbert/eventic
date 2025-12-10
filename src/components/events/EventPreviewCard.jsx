import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const EventPreviewCard = ({
    eventData,
    categories,
    tags,
    eventPhotos,
    tickets
}) => {
    // Calculate total tickets
    const totalTickets = tickets.reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0);

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle className="text-lg">Event Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Main Image Preview */}
                {eventData.mainImagePreview ? (
                    <img
                        src={eventData.mainImagePreview}
                        alt="Event preview"
                        className="w-full h-40 object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon size={32} className="text-gray-300" />
                    </div>
                )}

                {/* Summary */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Event Name</span>
                        <span className="text-gray-900 font-medium truncate ml-4 max-w-[150px]">
                            {eventData.name || '—'}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Category</span>
                        <span className="text-gray-900 font-medium">
                            {categories.find(c => c.id === eventData.category || c.id.toString() === eventData.category || c.id === parseInt(eventData.category))?.name || '—'}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Audience</span>
                        <span className="text-gray-900 font-medium">
                            {eventData.audience || '—'}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date</span>
                        <span className="text-gray-900 font-medium">
                            {eventData.startDate || '—'}
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
                            {eventData.city && eventData.country
                                ? `${eventData.city}, ${eventData.country}`
                                : '—'}
                        </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tags</span>
                        <span className="text-gray-900 font-medium">{tags.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Photos</span>
                        <span className="text-gray-900 font-medium">{eventPhotos.length + (eventData.mainImage ? 1 : 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ticket Types</span>
                        <span className="text-gray-900 font-medium">{tickets.filter(t => t.name).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Tickets</span>
                        <span className="text-gray-900 font-medium">{totalTickets}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventPreviewCard;
