import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Plus, Trash2, Users, Shield, Info } from 'lucide-react';
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
                        <Tag size={20} className="text-red-600" />
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
            <CardContent className="space-y-6">
                {tickets.map((ticket, index) => (
                    <div
                        key={ticket.id}
                        className="p-5 border border-gray-200 rounded-xl space-y-4 relative bg-white shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">Ticket {index + 1}</Badge>
                                {ticket.remaining !== undefined && (
                                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                        {ticket.remaining} Remaining
                                    </Badge>
                                )}
                            </div>
                            {tickets.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTicket(ticket.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Ticket Name */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Ticket Name *
                                </label>
                                <input
                                    type="text"
                                    value={ticket.name}
                                    onChange={(e) => handleTicketChange(ticket.id, 'name', e.target.value)}
                                    placeholder="e.g. VIP, Regular"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    required={index === 0}
                                />
                            </div>

                            {/* Status */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Status
                                </label>
                                <select
                                    value={ticket.status || 'active'}
                                    onChange={(e) => handleTicketChange(ticket.id, 'status', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="deactivated">Deactivated</option>
                                </select>
                            </div>
                        </div>

                        {/* Price & Sale Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Regular Price (GH₵) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₵</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={ticket.price}
                                        onChange={(e) => handleTicketChange(ticket.id, 'price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        required={index === 0}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Sale Price (GH₵)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₵</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={ticket.sale_price}
                                        onChange={(e) => handleTicketChange(ticket.id, 'sale_price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Leave blank if no sale price</p>
                            </div>
                        </div>

                        {/* Quantity & Max Per User */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        required={index === 0}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Max Per User
                                </label>
                                <div className="relative">
                                    <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        min="1"
                                        value={ticket.max_per_user}
                                        onChange={(e) => handleTicketChange(ticket.id, 'max_per_user', e.target.value)}
                                        placeholder="10"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Limit tickets per person</p>
                            </div>
                        </div>



                        {/* Sale Start & End Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Sale Start Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={ticket.sale_start}
                                    onChange={(e) => handleTicketChange(ticket.id, 'sale_start', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Sale End Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={ticket.sale_end}
                                    onChange={(e) => handleTicketChange(ticket.id, 'sale_end', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                                <Info size={14} className="text-gray-400" />
                                Description
                            </label>
                            <textarea
                                value={ticket.description}
                                onChange={(e) => handleTicketChange(ticket.id, 'description', e.target.value)}
                                placeholder="What's included in this ticket?"
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm resize-none"
                            />
                        </div>

                        {/* Ticket Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Ticket Image
                            </label>
                            {ticket.imagePreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={ticket.imagePreview}
                                        alt="Ticket"
                                        className="h-32 w-48 object-cover rounded-xl border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTicketImage(ticket.id)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg shadow-red-200"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-32 w-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all">
                                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500">Upload Ticket Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleTicketImageUpload(ticket.id, e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                    <span className="text-sm font-medium text-gray-600">Total capacity for all ticket types:</span>
                    <span className="text-lg font-bold text-gray-900">{totalTickets.toLocaleString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};

TicketsSection.propTypes = {
    tickets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string,
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            sale_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            remaining: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            max_per_user: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            sale_start: PropTypes.string,
            sale_end: PropTypes.string,
            description: PropTypes.string,
            status: PropTypes.string,
            dynamic_fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            imagePreview: PropTypes.string
        })
    ).isRequired,
    handleTicketChange: PropTypes.func.isRequired,
    handleTicketImageUpload: PropTypes.func.isRequired,
    removeTicketImage: PropTypes.func.isRequired,
    addTicket: PropTypes.func.isRequired,
    removeTicket: PropTypes.func.isRequired,
    totalTickets: PropTypes.number.isRequired
};

export default TicketsSection;
