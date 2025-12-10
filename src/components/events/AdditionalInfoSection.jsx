import React from 'react';
import { Globe, Facebook, Twitter, Instagram, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const AdditionalInfoSection = ({ eventData, handleEventChange }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe size={20} className="text-(--brand-primary)" />
                    Additional Information (Optional)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Website
                    </label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="url"
                            name="website"
                            value={eventData.website}
                            onChange={handleEventChange}
                            placeholder="https://example.com"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Facebook
                        </label>
                        <div className="relative">
                            <Facebook size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="facebook"
                                value={eventData.facebook}
                                onChange={handleEventChange}
                                placeholder="Facebook profile URL"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Twitter
                        </label>
                        <div className="relative">
                            <Twitter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="twitter"
                                value={eventData.twitter}
                                onChange={handleEventChange}
                                placeholder="Twitter profile URL"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Instagram
                        </label>
                        <div className="relative">
                            <Instagram size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="instagram"
                                value={eventData.instagram}
                                onChange={handleEventChange}
                                placeholder="Instagram profile URL"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={eventData.phone}
                                onChange={handleEventChange}
                                placeholder="+233 20 123 4567"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdditionalInfoSection;
