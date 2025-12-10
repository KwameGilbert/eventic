import React from 'react';
import { Images, Upload, X, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const MediaSection = ({
    eventData,
    handleEventChange,
    handleMainImageUpload,
    removeMainImage
}) => {
    return (
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
            </CardContent>
        </Card>
    );
};

export default MediaSection;
