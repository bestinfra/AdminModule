import React from 'react';

interface LoadingSpinnerProps {
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
    return (
        <div    
            className={`flex justify-center items-center h-full w-full ${className}`}>
            <div className="w-10 h-10 border-4 border-secondary border-t-primary  rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;
