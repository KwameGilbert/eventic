import React from 'react';
import PropTypes from 'prop-types';

/**
 * Empty State Component
 * Displays when no results are found
 */
const EmptyState = ({
    icon: Icon,
    title,
    message,
    actionLabel,
    onAction
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

EmptyState.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    actionLabel: PropTypes.string,
    onAction: PropTypes.func,
};

export default EmptyState;
