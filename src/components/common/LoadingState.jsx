import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

/**
 * Loading State Component
 * Displays centered loading spinner with message
 */
const LoadingState = ({ message = 'Loading...' }) => {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-(--brand-primary) mx-auto mb-4" />
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

LoadingState.propTypes = {
    message: PropTypes.string,
};

export default LoadingState;
