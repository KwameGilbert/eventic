import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";
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
} from "lucide-react";

// Category data with icons, colors, and descriptions
const categories = [
  {
    id: 1,
    name: "Concert / Music",
    slug: "concert-music",
    description: "Live music performances, concerts, and music festivals",
    icon: Music,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    hoverBorder: "hover:border-purple-400",
  },
  {
    id: 2,
    name: "Sport / Fitness",
    slug: "sport-fitness",
    description: "Sports events, matches, fitness activities",
    icon: Dumbbell,
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    hoverBorder: "hover:border-green-400",
  },
  {
    id: 3,
    name: "Theater / Arts",
    slug: "theater-arts",
    description: "Theater performances, art exhibitions, cultural events",
    icon: Theater,
    gradient: "from-rose-500 to-red-500",
    bgColor: "bg-rose-100",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
  },
  {
    id: 4,
    name: "Food & Drink",
    slug: "food-drink",
    description: "Food festivals, wine tastings, culinary events",
    icon: Utensils,
    gradient: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    hoverBorder: "hover:border-orange-400",
  },
  {
    id: 5,
    name: "Conference",
    slug: "conference",
    description: "Business conferences, seminars, professional events",
    icon: Users,
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
  },
  {
    id: 6,
    name: "Cinema",
    slug: "cinema",
    description: "Film screenings, movie premieres, film festivals",
    icon: Film,
    gradient: "from-slate-500 to-gray-700",
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
    hoverBorder: "hover:border-slate-400",
  },
  {
    id: 7,
    name: "Entertainment",
    slug: "entertainment",
    description: "Comedy shows, variety performances, entertainment events",
    icon: Laugh,
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    hoverBorder: "hover:border-yellow-400",
  },
  {
    id: 8,
    name: "Workshop",
    slug: "workshop",
    description: "Hands-on workshops, training sessions, skill-building events",
    icon: Wrench,
    gradient: "from-cyan-500 to-teal-500",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-200",
    hoverBorder: "hover:border-cyan-400",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/events?category=${slug}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO
        title="Event Categories"
        description="Browse events by category - Music, Sports, Theater, Food, Conferences and more on Eventic."
      />
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Browse by Interest
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
            Discover amazing events across Ghana tailored to what you love. From
            music to tech, we&apos;ve got you covered.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid - Visual & Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`group relative h-64 bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border border-gray-100 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2`}
              >
                {/* Visual Background */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${category.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                />

                {/* Pattern Overlay */}
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-125">
                  <IconComponent size={120} />
                </div>

                <div className="relative h-full p-8 flex flex-col justify-between">
                  {/* Icon Box */}
                  <div
                    className={`w-14 h-14 ${category.bgColor} rounded-2xl flex items-center justify-center shadow-sm`}
                  >
                    <IconComponent
                      className={`w-7 h-7 ${category.textColor}`}
                    />
                  </div>

                  {/* Label & Description */}
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-wide">
                    <span className="uppercase tracking-widest text-[10px]">
                      Explore Events
                    </span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search / Newsletter CTA - Premium Feel */}
        <div className="mt-20 relative rounded-[3rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-transparent pointer-events-none" />
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Want to see everything?
              </h2>
              <p className="text-white/60 text-lg font-medium">
                Jump into our full event list and use our powerful filters to
                find the perfect ticket for your next experience.
              </p>
            </div>

            <Link
              to="/events"
              className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 active:scale-95"
            >
              Browse All
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

// Export categories data for reuse elsewhere
export { categories };
