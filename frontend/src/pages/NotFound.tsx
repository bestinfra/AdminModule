import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-text-primary dark:text-text-primary">
                404
            </h1>
            <h2 className="text-2xl font-semibold mt-4 text-text-secondary dark:text-text-secondary">
                Page Not Found
            </h2>
            <p className="mt-2 text-neutral dark:text-neutral">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200">
                Return to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;
