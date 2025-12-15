import React from 'react';
import PropTypes from 'prop-types';

const AwardLocationMap = ({ mapUrl }) => {
    if (!mapUrl) return null;

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                    title="Award Location Map"
                ></iframe>
            </div>
        </div>
    );
};

AwardLocationMap.propTypes = {
    mapUrl: PropTypes.string,
};

export default AwardLocationMap;
