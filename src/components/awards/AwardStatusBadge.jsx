import React from 'react';
import PropTypes from 'prop-types';

/**
 * Award Status Badge Component
 * Displays visual badge indicating current award status
 */
const AwardStatusBadge = ({ status, className = '' }) => {
    const getStatusConfig = () => {
        switch (status?.toLowerCase()) {
            case 'voting_open':
            case 'voting open':
                return {
                    label: 'Voting Open',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    dotColor: 'bg-green-500'
                };
            case 'voting_closed':
            case 'voting closed':
                return {
                    label: 'Voting Closed',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    dotColor: 'bg-red-500'
                };
            case 'upcoming':
                return {
                    label: 'Upcoming',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    dotColor: 'bg-blue-500'
                };
            case 'completed':
                return {
                    label: 'Completed',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    dotColor: 'bg-gray-500'
                };
            case 'draft':
                return {
                    label: 'Draft',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    dotColor: 'bg-yellow-500'
                };
            default:
                return {
                    label: status || 'Unknown',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    dotColor: 'bg-gray-500'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`}></span>
            {config.label}
        </span>
    );
};

AwardStatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default AwardStatusBadge;
