import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * PageLoader - A reusable full-page loading component
 * 
 * @param {Object} props
 * @param {string} props.message - Loading message to display (default: "Loading...")
 * @param {string} props.size - Size of the loader: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} props.fullScreen - Whether to take full screen height (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const PageLoader = ({
    message = 'Loading...',
    size = 'md',
    fullScreen = true,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <div className={`${fullScreen ? 'min-h-screen' : 'min-h-[400px]'} bg-gray-50 flex items-center justify-center ${className}`}>
            <div className="text-center">
                <Loader2
                    className={`${sizeClasses[size]} animate-spin text-(--brand-primary) mx-auto mb-4`}
                />
                <p className={`text-gray-600 ${textSizeClasses[size]}`}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default PageLoader;
