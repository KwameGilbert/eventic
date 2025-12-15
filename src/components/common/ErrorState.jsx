import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Error State Component
 * Displays error message with retry button
 */
const ErrorState = ({
    title = 'Failed to Load',
    message,
    onRetry
}) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
            <p className="text-red-600 mb-4">{message}</p>
            <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                <RefreshCw size={18} />
                Try Again
            </button>
        </div>
    );
};

ErrorState.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func.isRequired,
};

export default ErrorState;
