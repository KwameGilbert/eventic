import React from 'react';
import { Tag, Plus, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const TicketsSection = ({
    tickets,
    handleTicketChange,
    handleTicketImageUpload,
    removeTicketImage,
    addTicket,
    removeTicket,
    totalTickets
}) => {
    return (
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

                        <div className="grid grid-cols-1 gap-4">
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
                                    required={index === 0}
                                />
                            </div>
                        </div>

                        {/* Price & Sale Price - 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Regular Price (GH₵) *
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
                                        required={index === 0}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Sale Price (GH₵)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">GH₵</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={ticket.promoPrice}
                                        onChange={(e) => handleTicketChange(ticket.id, 'promoPrice', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Optional promotional price (active during sale period)</p>
                            </div>
                        </div>

                        {/* Quantity & Max Per Order */}
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
                                        required={index === 0}
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
                                <p className="text-xs text-gray-400 mt-1">Limit per user/order</p>
                            </div>
                        </div>

                        {/* Sale Start & End Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Sale Start Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={ticket.saleStartDate}
                                    onChange={(e) => handleTicketChange(ticket.id, 'saleStartDate', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Sale End Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={ticket.saleEndDate}
                                    onChange={(e) => handleTicketChange(ticket.id, 'saleEndDate', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                />
                            </div>
                        </div>

                        {/* Description */}
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

                        {/* Ticket Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Ticket Image (Optional)
                            </label>
                            {ticket.ticketImagePreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={ticket.ticketImagePreview}
                                        alt="Ticket preview"
                                        className="h-32 w-48 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTicketImage(ticket.id)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-32 w-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm text-gray-500">Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleTicketImageUpload(ticket.id, e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            <p className="text-xs text-gray-400 mt-1">Recommended: 800x400px, max 2MB</p>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total tickets available:</span>
                    <span className="font-semibold text-gray-900">{totalTickets}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default TicketsSection;
