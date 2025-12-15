import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Page Header Component
 * Displays page title and breadcrumb navigation
 */
const PageHeader = ({ title, breadcrumbs }) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {crumb.path ? (
                                    <Link to={crumb.path} className="hover:text-(--brand-primary)">
                                        {crumb.icon || crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                                )}
                                {index < breadcrumbs.length - 1 && <span>/</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    breadcrumbs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            path: PropTypes.string,
            icon: PropTypes.node,
        })
    ).isRequired,
};

export default PageHeader;
