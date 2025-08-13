import React from 'react';

interface ErrorProps {
    // error: boolean | string | null;
    title?: string;
    message?:  boolean | string | null;
    onRetry?: () => void;
    showRetry?: boolean;
    className?: string;
}

const Error: React.FC<ErrorProps> = ({ 
    // error, 
    title , 
    message , 
    onRetry,
    showRetry = true,
    className = ''
}) => {
    // if (!error) return null;

    return (
        <section className={`flex items-center p-4 rounded-lg border shadow-sm text-warning border-warning-light bg-custom-warning ${className}`} role="alert" aria-live="polite" aria-atomic="true">
            <div className="flex items-center w-full">
                {/* Left Section - Error Information */}
                <div className="flex items-start flex-1 gap-3">
                    <figure className="flex-shrink-0 w-5 h-5 text-warning" aria-hidden="true">
                        <img 
                            src="/icons/network-error.svg" 
                            alt="Error icon" 
                            className="w-full h-full"
                        />
                    </figure>
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold leading-tight ">{title}</h2>
                        <p className="text-sm leading-tight mt-0.5">{message}</p>
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3">
                    {showRetry && onRetry && (
                        <div 
                            onClick={onRetry}
                            className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                        >
                            <img 
                                src="/icons/refresh.svg" 
                                alt="Retry" 
                                className="w-4 h-4"
                            />
                            <p>Retry</p>
                        </div>
                    )}
                    
                    <div 
                        className="p-1 h-6 w-6 text-sm font-medium cursor-pointer flex items-center justify-center"
                    >
                        <img 
                            src="/icons/close.svg" 
                            alt="Close" 
                            className="w-4 h-4"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Error;
