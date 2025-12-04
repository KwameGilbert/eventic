import React from 'react';

const PopularCategories = () => {
    const categories = [
        { name: 'Music', percentage: 40, count: '20,000', color: 'bg-(--brand-primary)' },
        { name: 'Sports', percentage: 35, count: '17,500', color: 'bg-blue-500' },
        { name: 'Fashion', percentage: 15, count: '12,500', color: 'bg-purple-500' },
        { name: 'Technology', percentage: 10, count: '8,000', color: 'bg-green-500' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Popular Events</h3>
                <button className="text-sm text-(--brand-primary) font-medium hover:underline">
                    Popular ↓
                </button>
            </div>

            <div className="p-4 space-y-4">
                {categories.map((category, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                            <span className="text-sm text-gray-500">{category.count} Events</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${category.color} rounded-full transition-all`}
                                    style={{ width: `${category.percentage}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-600 w-10 text-right">
                                {category.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularCategories;
