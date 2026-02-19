import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Globe,

  Calendar,
  AlertCircle,
  
} from "lucide-react";
import organizerService from "../services/organizerService";
import PageLoader from "../components/ui/PageLoader";
import SEO from "../components/common/SEO";

const OrganizerProfile = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [orgRes, eventsRes] = await Promise.all([
          organizerService.getById(id),
          organizerService.getEvents(id),
        ]);

        setOrganizer(orgRes.data || orgRes);
        setEvents(eventsRes.data?.data || eventsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch organizer profile:", err);
        setError("Organizer not found or failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizerData();
  }, [id]);

  if (isLoading) return <PageLoader message="Loading organizer profile..." />;

  if (error || !organizer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm max-w-md border border-gray-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Organizer Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            {error || "The organizer you are looking for does not exist."}
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title={`${organizer.name} - Organizer Profile`}
        description={
          organizer.bio ||
          `View events and awards organized by ${organizer.name}.`
        }
        image={organizer.image || organizer.avatar}
      />

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 shrink-0 -mt-20 md:mt-0 relative z-10">
              <img
                src={
                  organizer.image ||
                  organizer.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(organizer.name)}&background=f97316&color=fff&size=512`
                }
                alt={organizer.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                {organizer.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-500 mb-6">
                {organizer.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-(--brand-primary)" />
                    <span>{organizer.email}</span>
                  </div>
                )}
                {organizer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-(--brand-primary)" />
                    <span>{organizer.phone}</span>
                  </div>
                )}
                {organizer.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-(--brand-primary)" />
                    <a
                      href={organizer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-(--brand-primary) hover:underline font-semibold"
                    >
                      Official Website
                    </a>
                  </div>
                )}
              </div>

              <div className="max-w-3xl">
                <p className="text-gray-600 leading-relaxed italic border-l-4 border-gray-100 pl-4">
                  {organizer.bio ||
                    organizer.description ||
                    "No bio available for this organizer."}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-row md:flex-col gap-4 shrink-0">
              <div className="bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100 text-center min-w-[120px]">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">
                  Events
                </p>
                <p className="text-3xl font-black text-orange-700 leading-none">
                  {events.length}
                </p>
              </div>
              <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center min-w-[120px]">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  Joined
                </p>
                <p className="text-sm font-black text-blue-700 leading-none">
                  {organizer.created_at
                    ? new Date(organizer.created_at).getFullYear()
                    : "2024"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10 flex items-center gap-3">
          <Calendar size={24} className="text-gray-400" />
          <h2 className="text-2xl font-black text-gray-900">
            Events by {organizer.name}
          </h2>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      event.image ||
                      "https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?w=800&q=80"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                      {event.category_name || "Event"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-(--brand-primary) transition-colors mb-3">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} className="text-(--brand-primary)" />
                    <span className="truncate">
                      {event.venue || event.location}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100">
            <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No active events
            </h3>
            <p className="text-gray-500">
              This organizer currently has no public events or awards listed.
            </p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to organize your own event?
          </h2>
          <p className="text-gray-500 mb-8">
            Join our community of elite organizers and reaching thousands of
            attendees.
          </p>
          <Link
            to="/signup/organizer"
            className="inline-block px-8 py-4 bg-(--brand-primary) text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all"
          >
            Join as an Organizer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;
