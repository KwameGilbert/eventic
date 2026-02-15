import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Loader2, Upload } from 'lucide-react';
import { Button } from '../../ui/button';
import nomineeService from '../../../services/nomineeService';

const NomineeModal = ({ isOpen, onClose, categoryId, nominee = null, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        imagePreview: ''
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (nominee) {
            setFormData({
                name: nominee.name || '',
                description: nominee.description || '',
                image: null,
                imagePreview: nominee.image || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                image: null,
                imagePreview: ''
            });
        }
        setError(null);
    }, [nominee, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Prepare FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description || '');

            // Add image only if a new one was uploaded
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            if (nominee) {
                // Update existing nominee
                await nomineeService.update(nominee.id, submitData);
            } else {
                // Create new nominee
                await nomineeService.create(categoryId, submitData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving nominee:', err);
            setError(err.message || 'Failed to save nominee');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                        {nominee ? 'Edit Nominee' : 'Add Nominee'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error Alert */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Nominee Code (Read Only) */}
                    {nominee && nominee.nominee_code && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nominee Code (Read Only)
                            </label>
                            <input
                                type="text"
                                value={nominee.nominee_code}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed uppercase font-mono"
                            />
                        </div>
                    )}

                    {/* Nominee Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nominee Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="e.g., Sarkodie"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Brief description or biography..."
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nominee Image
                        </label>
                        {formData.imagePreview ? (
                            <div className="relative">
                                <img
                                    src={formData.imagePreview}
                                    alt="Nominee preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    disabled={isSubmitting}
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
                                    id="nominee-image-upload"
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="nominee-image-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to upload nominee image</span>
                                    <span className="text-xs text-gray-400 mt-1">Recommended: 400x400px</span>
                                </label>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Upload a photo of the nominee (optional)
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting || !formData.name}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                nominee ? 'Update Nominee' : 'Add Nominee'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

NomineeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    categoryId: PropTypes.number.isRequired,
    nominee: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string
    }),
    onSuccess: PropTypes.func.isRequired
};

export default NomineeModal;

