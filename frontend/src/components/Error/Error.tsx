import React from 'react';

interface ErrorProps {
    error?: boolean | string | null;
    title?: string;
    message?: boolean | string | null;
    visibleErrors?: string[];        // New: parent provides exactly what to show
    totalErrors?: number;            // New: total count for progress indicator
    onRetry?: () => void;
    onClick?: () => void;
    onClose?: () => void;
    showRetry?: boolean;
    className?: string;
}

const Error: React.FC<ErrorProps> = ({ 
    error, 
    message, 
    visibleErrors,                // New prop
    totalErrors,                   // New prop
    onRetry,
    onClick,
    onClose,
    showRetry = true,
    className = ''
}) => {
    // Temporary debug logging
    console.log('Error component rendered with props:', { error, message, visibleErrors, totalErrors, onRetry, onClose, showRetry, className });
    
    // If no error, no message, and no visibleErrors, don't render anything
    if (!error && !message && (!visibleErrors || visibleErrors.length === 0)) {
        console.log('Error component returning null');
        return null;
    }

    // Use visibleErrors if provided, otherwise fallback to message/error
    const errors = visibleErrors || [message || error];
    const hasMultipleErrors = errors.length > 1;
    
    // // Use totalErrors if provided, otherwise use visible errors length
    // const _totalErrorCount = totalErrors || errors.length;

    return (
        <section className={`relative ${className}`} role="alert" aria-live="polite" aria-atomic="true">
            <div className="relative">
                {/* Background Stacked Cards - showing max 2 background cards */}
                {hasMultipleErrors && errors.slice(1).map((_, index) => {
                    const cardIndex = index + 1;
                    const offset = cardIndex * 3; // Small offset to show edges
                    
                    return (
                        <div
                            key={`background-${cardIndex}`}
                            className="absolute rounded-lg border border-red-200 bg-red-50 opacity-40 transition-all duration-300 ease-in-out"
                            style={{
                                top: `-${offset}px`,
                                left: `${offset}px`,
                                right: `${offset}px`,
                                bottom: `${offset}px`,
                                zIndex: 5 - cardIndex,
                            }}
                        />
                    );
                })}

                {/* Progress Indicator - if more than 3 errors */}
                {/* {hasMultipleErrors && (
                    <div className="absolute -top-8 left-0 right-0 flex justify-center">
                        <div className="bg-red-100 px-3 py-1 rounded-full text-xs font-medium text-red-700">
                            {totalErrorCount > 3 ? `${totalErrorCount} total errors` : `${totalErrorCount} errors`}
                        </div>
                    </div>
                )} */}

                {/* Main Error Card */}
                <div className="relative z-10 flex items-center p-4 rounded-lg border text-warning border-warning-light bg-custom-warning transition-all duration-300 ease-in-out">
                    <div className="flex items-center w-full">
                        <div className="flex items-start flex-1 gap-3">
                            <figure className="flex-shrink-0 w-5 h-5 text-warning" aria-hidden="true">
                                <img 
                                    src="/icons/network-error.svg" 
                                    alt="Error icon" 
                                    className="w-full h-full"
                                />
                            </figure>
                            <div className="flex flex-col">
                                {hasMultipleErrors ? (
                                    <p className="text-sm leading-tight mt-0.5 text-warning">
                                        {errors[0]}
                                    </p>
                                ) : (
                                    <p className="text-sm leading-tight">{errors[0]}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {showRetry && (onRetry || onClick) && (
                                <div 
                                    onClick={onRetry || onClick}
                                    className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-red-100 px-2 py-1 rounded transition-colors duration-200"
                                >
                                    <img 
                                        src="/icons/refresh.svg" 
                                        alt="Retry" 
                                        className="w-4 h-4"
                                    />
                                    <p>Retry</p>
                                </div>
                            )}
                            
                            {onClose && (
                                <div 
                                    onClick={onClose}
                                    className="p-1 h-6 w-6 text-sm hover:bg-red-100 rounded-full font-medium cursor-pointer flex items-center justify-center transition-colors duration-200"
                                >
                                    <img 
                                        src="/icons/close.svg" 
                                        alt="Close" 
                                        className="w-4 h-4"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Error;
