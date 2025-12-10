import React from 'react';
import { MapPin, Map, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const LocationSection = ({ eventData, countries, handleEventChange }) => {
    return (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            City *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={eventData.city}
                            onChange={handleEventChange}
                            placeholder="Accra"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Region/State *
                        </label>
                        <input
                            type="text"
                            name="region"
                            value={eventData.region}
                            onChange={handleEventChange}
                            placeholder="Greater Accra"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Country *
                        </label>
                        <div className="relative">
                            <select
                                name="country"
                                value={eventData.country}
                                onChange={handleEventChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                required
                            >
                                <option value="">Select country</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <span className="flex items-center gap-2">
                            <Map size={14} />
                            Google Maps URL
                        </span>
                    </label>
                    <input
                        type="url"
                        name="mapsUrl"
                        value={eventData.mapsUrl}
                        onChange={handleEventChange}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                    />
                    <p className="text-xs text-gray-400 mt-1">Paste a Google Maps link for attendees to find the venue</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default LocationSection;
