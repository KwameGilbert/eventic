import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Loader2, Tag, Users, ToggleLeft, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import ticketService from '../../services/ticketService';

const TicketTypeModal = ({ isOpen, onClose, eventId, ticket = null, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        max_per_user: '10',
        sale_price: '',
        sale_start: '',
        sale_end: '',
        status: 'active',
        ticket_image: null,
        imagePreview: ''
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (ticket) {
            setFormData({
                name: ticket.name || '',
                description: ticket.description || '',
                price: ticket.price || '',
                quantity: ticket.quantity || '',
                max_per_user: ticket.max_per_user || ticket.max_per_order || ticket.maxPerOrder || '10',
                sale_price: (ticket.sale_price || ticket.salePrice || '').toString(),
                sale_start: ticket.sale_start ? ticket.sale_start.substring(0, 16) : (ticket.saleStartDate ? ticket.saleStartDate.substring(0, 16) : ''),
                sale_end: ticket.sale_end ? ticket.sale_end.substring(0, 16) : (ticket.saleEndDate ? ticket.saleEndDate.substring(0, 16) : ''),
                status: ticket.status || 'active',
                ticket_image: null,
                imagePreview: ticket.ticket_image || ticket.ticketImage || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                max_per_user: '10',
                sale_price: '',
                sale_start: '',
                sale_end: '',
                status: 'active'
            });
        }
        setError(null);
    }, [ticket, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                ticket_image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            ticket_image: null,
            imagePreview: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('event_id', eventId);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', parseFloat(formData.price));
            formDataToSend.append('quantity', parseInt(formData.quantity));
            formDataToSend.append('max_per_user', parseInt(formData.max_per_user));
            formDataToSend.append('status', formData.status);

            if (formData.sale_price) {
                formDataToSend.append('sale_price', parseFloat(formData.sale_price));
            }
            if (formData.sale_start) {
                formDataToSend.append('sale_start', formData.sale_start);
            }
            if (formData.sale_end) {
                formDataToSend.append('sale_end', formData.sale_end);
            }
            if (formData.ticket_image) {
                formDataToSend.append('ticket_image', formData.ticket_image);
            }

            if (ticket) {
                // Update existing ticket type
                await ticketService.updateTicketType(ticket.id, formDataToSend);
            } else {
                // Create new ticket type
                await ticketService.createTicketType(formDataToSend);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving ticket type:', err);
            setError(err.response?.data?.message || err.message || 'Failed to save ticket type');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Tag className="text-red-600" size={24} />
                            {ticket ? 'Edit Ticket Type' : 'Add Ticket Type'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Configure ticket access and pricing</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Error Alert */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-3">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Ticket Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                placeholder="e.g., Early Bird, VIP Experience"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Price (GH₵) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₵</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                    placeholder="0.00"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Sale Price */}
                        <div>
                            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
                                Sale Price (Optional)
                                <Tag size={14} className="text-blue-500" />
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₵</span>
                                <input
                                    type="number"
                                    name="sale_price"
                                    value={formData.sale_price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Discounted price"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Ticket Image */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                                <ImageIcon size={16} className="text-gray-400" />
                                Ticket Image (Optional)
                            </label>
                            {formData.imagePreview ? (
                                <div className="relative inline-block group">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Ticket"
                                        className="w-full max-w-[200px] h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-all hover:scale-110"
                                    >
                                        <X size={14} className="text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-50/50 transition-all group">
                                    <Upload size={24} className="text-gray-400 mb-2 group-hover:text-red-400 transition-colors" />
                                    <span className="text-xs text-gray-500 font-medium group-hover:text-red-600 transition-colors">Click to upload ticket image</span>
                                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isSubmitting}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Total Inventory <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                    placeholder="e.g., 100"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Max Per User */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Max Per User
                            </label>
                            <input
                                type="number"
                                name="max_per_user"
                                value={formData.max_per_user}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                placeholder="10"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Status */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
                                Ticket Status
                                <ToggleLeft size={14} className="text-gray-400" />
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none bg-white"
                                disabled={isSubmitting}
                            >
                                <option value="active">Active (Visible to users)</option>
                                <option value="deactivated">Deactivated (Hidden from users)</option>
                            </select>
                        </div>

                        {/* Sale Start */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Sale Start (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                name="sale_start"
                                value={formData.sale_start}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Sale End */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Sale End (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                name="sale_end"
                                value={formData.sale_end}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none resize-none"
                                placeholder="Describe what's included (e.g., Welcome drink, Front row seat)..."
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl py-6"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
                            disabled={isSubmitting || !formData.name || !formData.price || !formData.quantity}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                ticket ? 'Update Ticket Type' : 'Create Ticket Type'
                            )}
                        </Button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

TicketTypeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    eventId: PropTypes.string.isRequired,
    ticket: PropTypes.object,
    onSuccess: PropTypes.func.isRequired
};

export default TicketTypeModal;
