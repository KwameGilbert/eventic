import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Globe, ChevronDown, ChevronUp, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-[var(--footer-bg)] text-[var(--text-secondary)] font-sans">
            {/* Top CTA Section */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h2 className="text-xl md:text-2xl text-[var(--text-primary)] font-light text-center md:text-left">
                        Are you ready to take your <span className="font-bold">theater</span> event to the next level ?
                    </h2>
                    <button className="bg-white hover:bg-gray-50 text-[var(--text-primary)] font-semibold py-2.5 px-6 rounded-full shadow-sm border border-gray-200 flex items-center gap-2 transition-colors">
                        <Calendar size={18} />
                        CREATE MY EVENT
                    </button>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Useful Links */}
                    <div>
                        <h3 className="text-[var(--text-primary)] font-bold text-lg mb-4">Useful Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-[var(--brand-primary)] transition-colors">About us</Link></li>
                            <li><Link to="/help" className="hover:text-[var(--brand-primary)] transition-colors">Help center</Link></li>
                            <li><Link to="/blog" className="hover:text-[var(--brand-primary)] transition-colors">Blog</Link></li>
                            <li><Link to="/venues" className="hover:text-[var(--brand-primary)] transition-colors">Venues</Link></li>
                            <li><Link to="/contact" className="hover:text-[var(--brand-primary)] transition-colors">Send us an email</Link></li>
                        </ul>
                    </div>

                    {/* My Account */}
                    <div>
                        <h3 className="text-[var(--text-primary)] font-bold text-lg mb-4">My Account</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/register" className="hover:text-[var(--brand-primary)] transition-colors">Create an account</Link></li>
                            <li><Link to="/sell" className="hover:text-[var(--brand-primary)] transition-colors">Sell tickets online</Link></li>
                            <li><Link to="/tickets" className="hover:text-[var(--brand-primary)] transition-colors">My tickets</Link></li>
                            <li><Link to="/forgot-password" className="hover:text-[var(--brand-primary)] transition-colors">Forgot your password ?</Link></li>
                            <li><Link to="/pricing" className="hover:text-[var(--brand-primary)] transition-colors">Pricing and fees</Link></li>
                        </ul>
                    </div>

                    {/* Event Categories */}
                    <div>
                        <h3 className="text-[var(--text-primary)] font-bold text-lg mb-4">Event Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/category/music" className="hover:text-[var(--brand-primary)] transition-colors">Concert / Music</Link></li>
                            <li><Link to="/category/trip" className="hover:text-[var(--brand-primary)] transition-colors">Trip / Camp</Link></li>
                            <li><Link to="/category/sport" className="hover:text-[var(--brand-primary)] transition-colors">Sport / Fitness</Link></li>
                            <li><Link to="/category/cinema" className="hover:text-[var(--brand-primary)] transition-colors">Cinema</Link></li>
                            <li><Link to="/categories" className="hover:text-[var(--brand-primary)] transition-colors">All categories</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-[var(--text-primary)] font-bold text-lg mb-4">Contact Us</h3>
                        <div className="space-y-2 text-sm mb-6">
                            <p><span className="font-semibold text-[var(--text-primary)]">Phone:</span> +123456789</p>
                            <p><span className="font-semibold text-[var(--text-primary)]">Fax:</span> +123456789</p>
                        </div>

                        <div className="flex space-x-3 mb-6">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-[var(--color-social-fb)] hover:opacity-90 transition-opacity">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-[var(--color-social-insta)] hover:opacity-90 transition-opacity">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-[var(--color-social-yt)] hover:opacity-90 transition-opacity">
                                <Youtube size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-[var(--color-social-tw)] hover:opacity-90 transition-opacity">
                                <Twitter size={20} />
                            </a>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                            <Globe size={18} />
                            <span>Language</span>
                            <div className="flex items-center gap-1 ml-2 cursor-pointer">
                                <span>English</span>
                                <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-5 h-auto" />
                                <ChevronDown size={12} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-[var(--text-secondary)]">
                        <Link to="/terms" className="hover:text-[var(--brand-primary)]">Terms of service</Link>
                        <Link to="/privacy" className="hover:text-[var(--brand-primary)]">Privacy policy</Link>
                        <Link to="/cookie" className="hover:text-[var(--brand-primary)]">Cookie policy</Link>
                        <Link to="/gdpr" className="hover:text-[var(--brand-primary)]">GDPR compliance</Link>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Copyright © 2025</p>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 w-10 h-10 bg-[var(--brand-primary)] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-50"
                aria-label="Scroll to top"
            >
                <ChevronUp size={24} />
            </button>
        </footer>
    );
};

export default Footer;
