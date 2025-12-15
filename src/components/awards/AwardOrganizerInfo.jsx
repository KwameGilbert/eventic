import React from 'react';
import PropTypes from 'prop-types';

const AwardOrganizerInfo = ({ organizer }) => {
    if (!organizer) return null;

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Organized By</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    {organizer.avatar && (
                        <img
                            src={organizer.avatar}
                            alt={organizer.name}
                            className="w-20 h-20 rounded-full object-cover shrink-0"
                        />
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{organizer.name}</h3>
                            {organizer.verified && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                    Verified
                                </span>
                            )}
                        </div>
                        {organizer.bio && (
                            <p className="text-gray-600 text-sm leading-relaxed">{organizer.bio}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

AwardOrganizerInfo.propTypes = {
    organizer: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        bio: PropTypes.string,
        verified: PropTypes.bool,
    }),
};

export default AwardOrganizerInfo;
