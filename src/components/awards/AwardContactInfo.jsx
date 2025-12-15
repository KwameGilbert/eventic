import React from 'react';
import PropTypes from 'prop-types';

const AwardContactInfo = ({ contact, socialMedia }) => {
    if (!contact && !socialMedia) return null;

    const hasSocialMedia = socialMedia && (socialMedia.facebook || socialMedia.twitter || socialMedia.instagram);

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* Contact Details */}
                {contact && (contact.phone || contact.website) && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Get in Touch</h3>
                        <div className="space-y-2">
                            {contact.phone && (
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="flex items-center gap-2 text-gray-600 hover:text-(--brand-primary) transition-colors"
                                >
                                    <span className="text-sm">📞</span>
                                    <span className="text-sm">{contact.phone}</span>
                                </a>
                            )}
                            {contact.website && (
                                <a
                                    href={contact.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-600 hover:text-(--brand-primary) transition-colors"
                                >
                                    <span className="text-sm">🌐</span>
                                    <span className="text-sm">{contact.website}</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Social Media Links */}
                {hasSocialMedia && (
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                            {socialMedia.facebook && (
                                <a
                                    href={`https://facebook.com/${socialMedia.facebook}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Facebook
                                </a>
                            )}
                            {socialMedia.twitter && (
                                <a
                                    href={`https://twitter.com/${socialMedia.twitter}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Twitter
                                </a>
                            )}
                            {socialMedia.instagram && (
                                <a
                                    href={`https://instagram.com/${socialMedia.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Instagram
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

AwardContactInfo.propTypes = {
    contact: PropTypes.shape({
        phone: PropTypes.string,
        website: PropTypes.string,
    }),
    socialMedia: PropTypes.shape({
        facebook: PropTypes.string,
        twitter: PropTypes.string,
        instagram: PropTypes.string,
    }),
};

export default AwardContactInfo;
