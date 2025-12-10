import React from 'react';
import { FileText, ChevronDown, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const BasicInformationSection = ({
    eventData,
    categories,
    audienceOptions,
    tags,
    tagInput,
    isLoadingCategories,
    categoriesError,
    handleEventChange,
    setTagInput,
    handleTagKeyDown,
    addTag,
    removeTag
}) => {
    return (
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

                {/* Category, Audience & Language */}
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
                                disabled={isLoadingCategories || categoriesError}
                            >
                                <option value="">
                                    {isLoadingCategories
                                        ? 'Loading categories...'
                                        : categoriesError
                                            ? 'Failed to load categories'
                                            : 'Select category'}
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        {categoriesError && (
                            <p className="text-xs text-red-600 mt-1">
                                {categoriesError}. Please refresh the page or contact support.
                            </p>
                        )}
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

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Language
                    </label>
                    <input
                        type="text"
                        name="language"
                        value={eventData.language}
                        onChange={handleEventChange}
                        placeholder="e.g., English, French, Spanish"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                    />
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
        </Card >
    );
};

export default BasicInformationSection;
