import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import categoryService from '../../../services/categoryService';

const CategoryModal = ({ isOpen, onClose, awardId, category = null, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cost_per_vote: '1.00'
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                cost_per_vote: category.cost_per_vote || '1.00'
            });
        } else {
            setFormData({
                name: '',
                description: '',
                cost_per_vote: '1.00'
            });
        }
        setError(null);
    }, [category, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (category) {
                // Update existing category
                await categoryService.update(category.id, formData);
            } else {
                // Create new category
                await categoryService.create(awardId, formData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving category:', err);
            setError(err.message || 'Failed to save category');
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
                        {category ? 'Edit Category' : 'Add Category'}
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

                    {/* Category Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="e.g., Best Artist of the Year"
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
                            placeholder="Brief description of this category..."
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Cost Per Vote */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cost Per Vote (GH₵) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="cost_per_vote"
                            value={formData.cost_per_vote}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="1.00"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Amount voters will pay for each vote in this category
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
                                category ? 'Update Category' : 'Add Category'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CategoryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    awardId: PropTypes.string,
    category: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        cost_per_vote: PropTypes.string
    }),
    onSuccess: PropTypes.func.isRequired
};

export default CategoryModal;

