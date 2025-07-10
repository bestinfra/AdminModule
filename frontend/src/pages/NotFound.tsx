import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200">
                404
            </h1>
            <h2 className="text-2xl font-semibold mt-4 text-gray-700 dark:text-gray-300">
                Page Not Found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Return to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;
