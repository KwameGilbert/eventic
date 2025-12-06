import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Music,
    Dumbbell,
    Theater,
    Utensils,
    Users,
    Film,
    Laugh,
    Wrench,
    ArrowRight,
    Home as HomeIcon
} from 'lucide-react';

// Category data with icons, colors, and descriptions
const categories = [
    {
        id: 1,
        name: 'Concert / Music',
        slug: 'concert-music',
        description: 'Live music performances, concerts, and music festivals',
        icon: Music,
        gradient: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-200',
        hoverBorder: 'hover:border-purple-400'
    },
    {
        id: 2,
        name: 'Sport / Fitness',
        slug: 'sport-fitness',
        description: 'Sports events, matches, fitness activities',
        icon: Dumbbell,
        gradient: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        borderColor: 'border-green-200',
        hoverBorder: 'hover:border-green-400'
    },
    {
        id: 3,
        name: 'Theater / Arts',
        slug: 'theater-arts',
        description: 'Theater performances, art exhibitions, cultural events',
        icon: Theater,
        gradient: 'from-rose-500 to-red-500',
        bgColor: 'bg-rose-100',
        textColor: 'text-rose-600',
        borderColor: 'border-rose-200',
        hoverBorder: 'hover:border-rose-400'
    },
    {
        id: 4,
        name: 'Food & Drink',
        slug: 'food-drink',
        description: 'Food festivals, wine tastings, culinary events',
        icon: Utensils,
        gradient: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        hoverBorder: 'hover:border-orange-400'
    },
    {
        id: 5,
        name: 'Conference',
        slug: 'conference',
        description: 'Business conferences, seminars, professional events',
        icon: Users,
        gradient: 'from-blue-500 to-indigo-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        hoverBorder: 'hover:border-blue-400'
    },
    {
        id: 6,
        name: 'Cinema',
        slug: 'cinema',
        description: 'Film screenings, movie premieres, film festivals',
        icon: Film,
        gradient: 'from-slate-500 to-gray-700',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
        borderColor: 'border-slate-200',
        hoverBorder: 'hover:border-slate-400'
    },
    {
        id: 7,
        name: 'Entertainment',
        slug: 'entertainment',
        description: 'Comedy shows, variety performances, entertainment events',
        icon: Laugh,
        gradient: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
        borderColor: 'border-yellow-200',
        hoverBorder: 'hover:border-yellow-400'
    },
    {
        id: 8,
        name: 'Workshop',
        slug: 'workshop',
        description: 'Hands-on workshops, training sessions, skill-building events',
        icon: Wrench,
        gradient: 'from-cyan-500 to-teal-500',
        bgColor: 'bg-cyan-100',
        textColor: 'text-cyan-600',
        borderColor: 'border-cyan-200',
        hoverBorder: 'hover:border-cyan-400'
    }
];

const Categories = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (slug) => {
        navigate(`/events?category=${slug}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header - Matching BrowseEvents style */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Event Categories</h1>
                            <p className="text-gray-500 mt-1">Discover events by your interests</p>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-(--brand-primary)">
                                <HomeIcon size={16} />
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Categories</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.slug)}
                                className={`group bg-white rounded-2xl border-2 ${category.borderColor} ${category.hoverBorder} p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 ${category.bgColor} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                                    <IconComponent className={`w-7 h-7 ${category.textColor}`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-(--brand-primary) transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {category.description}
                                </p>

                                {/* Link */}
                                <div className="flex items-center gap-2 text-(--brand-primary) font-medium text-sm group-hover:gap-3 transition-all">
                                    <span>Browse Events</span>
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Browse All CTA */}
                <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Looking for something specific?
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Browse all events and use our advanced filters to find exactly what you need.
                    </p>
                    <Link
                        to="/events"
                        className="inline-flex items-center gap-2 bg-(--brand-primary) text-white px-6 py-3 rounded-xl font-semibold hover:bg-(--brand-primary)/90 transition-all hover:-translate-y-0.5"
                    >
                        Browse All Events
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Categories;

// Export categories data for reuse elsewhere
export { categories };
