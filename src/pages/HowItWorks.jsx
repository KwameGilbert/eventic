import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Calendar, ChevronRight, HelpCircle, Mail, MessageCircle } from 'lucide-react';

const HowItWorks = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const attendeeArticles = [
        { title: 'How to book tickets?', link: '#' },
        { title: 'How can I present my ticket at the event entrance?', link: '#' },
        { title: 'Registration', link: '#' },
        { title: 'Where can I find my tickets?', link: '#' },
        { title: 'What does a ticket look like?', link: '#' },
    ];

    const organizerArticles = [
        { title: 'How to verify a purchased ticket?', link: '#' },
        { title: 'How can I edit my organizer profile?', link: '#' },
        { title: 'Registration', link: '#' },
        { title: 'Add my event', link: '#' },
        { title: 'Add my venues', link: '#' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero / Search Section */}
            <div className="bg-(--brand-primary) py-20 px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        How can we help?
                    </h1>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-4 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 shadow-lg text-lg"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Organizers, attendees, this support center is intended to quickly reply to your questions.
                        If you still don't find answers, please contact us, we will be happy to receive your inquiry.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Attendee Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="p-8 text-center border-b border-gray-100">
                            <div className="w-16 h-16 bg-(--brand-primary) rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-(--brand-primary)/30 transform rotate-3">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Attendee</h2>
                            <p className="text-gray-500 mt-2">Guides and FAQs for event goers</p>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4 mb-8">
                                {attendeeArticles.map((article, index) => (
                                    <li key={index}>
                                        <Link
                                            to={article.link}
                                            className="text-(--brand-primary) hover:text-(--brand-primary)/80 font-medium flex items-center gap-2 group transition-colors"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-(--brand-primary)/40 group-hover:bg-(--brand-primary) transition-colors"></span>
                                            {article.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 px-4 rounded-xl border-2 border-(--brand-primary) text-(--brand-primary) font-bold hover:bg-(--brand-primary) hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
                                SEE MORE ARTICLES
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Organizer Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="p-8 text-center border-b border-gray-100">
                            <div className="w-16 h-16 bg-(--brand-primary) rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-(--brand-primary)/30 transform -rotate-3">
                                <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Organizer</h2>
                            <p className="text-gray-500 mt-2">Tools and tips for event creators</p>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4 mb-8">
                                {organizerArticles.map((article, index) => (
                                    <li key={index}>
                                        <Link
                                            to={article.link}
                                            className="text-(--brand-primary) hover:text-(--brand-primary)/80 font-medium flex items-center gap-2 group transition-colors"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-(--brand-primary)/40 group-hover:bg-(--brand-primary) transition-colors"></span>
                                            {article.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 px-4 rounded-xl border-2 border-(--brand-primary) text-(--brand-primary) font-bold hover:bg-(--brand-primary) hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
                                SEE MORE ARTICLES
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center max-w-4xl mx-auto">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="h-8 w-8 text-(--brand-primary)" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Still need help?
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                        You did not find an answer to your inquiry? Let us know and we will be glad to give you further help.
                    </p>
                    <button className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <Mail className="w-5 h-5 mr-2" />
                        CONTACT US
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
