import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Helper function to generate slug from category name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/\s*\/\s*/g, '-')  // Replace " / " with "-"
        .replace(/\s*&\s*/g, '-')   // Replace " & " with "-"
        .replace(/\s+/g, '-')       // Replace spaces with "-"
        .replace(/[^a-z0-9-]/g, '') // Remove special characters
        .replace(/-+/g, '-')        // Replace multiple dashes with single dash
        .replace(/^-|-$/g, '');     // Remove leading/trailing dashes
};

const FeaturedCategories = ({ categories }) => {
    return (
        <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
                    <p className="text-gray-600">Explore events across different categories</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => {
                        const slug = category.slug || generateSlug(category.name);
                        return (
                            <Link
                                to={`/events?category=${slug}`}
                                key={category.id}
                                className="group relative overflow-hidden rounded-xl cursor-pointer h-40 transform hover:scale-105 transition-transform duration-300 block"
                            >
                                {/* Background Image with Overlay */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${category.image})` }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
                                    <div className="text-4xl mb-2">{category.icon}</div>
                                    <h3 className="text-sm font-bold text-center mb-1">{category.name}</h3>
                                    <p className="text-xs opacity-90">{category.eventCount} events</p>

                                    {/* Hover Arrow */}
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Categories Button */}
                <div className="mt-10 text-center">
                    <Link
                        to="/categories"
                        className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-full border-2 border-gray-200 transition-colors"
                    >
                        View All Categories
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCategories;
