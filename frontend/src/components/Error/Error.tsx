import React, { useState, useEffect } from 'react';

interface ErrorProps {
    error?: boolean | string | null;
    title?: string;
    message?: boolean | string | null;
    visibleErrors?: string[];        // Parent provides error array
    totalErrors?: number;            // Total count for progress indicator
    onRetry?: () => void;
    onClick?: () => void;
    onClose?: () => void;
    showRetry?: boolean;
    className?: string;
    maxVisibleErrors?: number;       // New: max errors to show at once
    failedApis?: Array<{            // New: track which APIs failed
        id: string;
        name: string;
        retryFunction: () => Promise<void>;
        errorMessage: string;
    }>;
    onRetrySpecific?: (apiId: string) => void; // New: retry specific API
}

const Error: React.FC<ErrorProps> = ({ 
    error, 
    message, 
    visibleErrors,                
    // totalErrors,                   
    onRetry,
    onClick,
    // onClose,
    showRetry = true,
    className = '',
    maxVisibleErrors = 3,          // Default to show max 3 errors
    failedApis = [],               // Default to empty array
    onRetrySpecific               // Optional: retry specific API
}) => {
    // Internal state for managing visible errors
    const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
    const [internalErrors, setInternalErrors] = useState<string[]>([]);
    
    // Use visibleErrors if provided, otherwise fallback to message/error
    // const _errors = visibleErrors || [message || error];
    
    // Update inter_nal errors when visibleErrors change
    useEffect(() => {
        if (visibleErrors) {
            setInternalErrors(visibleErrors);
        }
    }, [visibleErrors]);
    
    // Calculate which errors to show (sliding window)
    const visibleErrorSlice = internalErrors.slice(currentErrorIndex, currentErrorIndex + maxVisibleErrors);
    const hasMultipleErrors = internalErrors.length > 1;
    
    // Reset current error index when errors change
    useEffect(() => {
        setCurrentErrorIndex(0);
    }, [internalErrors.length]);

    // If no error, no message, and no visibleErrors, don't render anything
    if (!error && !message && (!visibleErrors || visibleErrors.length === 0)) {
        return null;
    }



    // Remove a specific error internally
    const handleRemoveError = (indexToRemove: number) => {
        const newErrors = internalErrors.filter((_, index) => index !== indexToRemove);
        setInternalErrors(newErrors);
        
        // If we're at the end and there are more errors, move back
        if (currentErrorIndex >= newErrors.length && currentErrorIndex > 0) {
            setCurrentErrorIndex(prev => Math.max(0, prev - 1));
        }
        
        // Don't call parent onClose - handle everything internally
        // This prevents closing all errors when just one is removed
    };

    // Handle retry for specific API
    const handleRetrySpecific = (apiId: string) => {
        if (onRetrySpecific) {
            onRetrySpecific(apiId);
        }
    };

    return (
        <section className={`relative ${className}`} role="alert" aria-live="polite" aria-atomic="true">
            <div className="relative">
                {/* Background Stacked Cards - showing max 2 background cards */}
                {hasMultipleErrors && visibleErrorSlice.slice(1).map((_, index) => {
                    const cardIndex = index + 1;
                    const offset = cardIndex * 3; // Small offset to show edges
                    
                    return (
                        <div
                            key={`background-${cardIndex}`}
                            className="absolute rounded-lg border border-red-200 bg-red-50 opacity-40"
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

                {/* Progress Indicator - if more than maxVisibleErrors */}
                {/* {hasMoreErrors && (
                    <div className="absolute -top-8 left-0 right-0 flex justify-center items-center gap-2">
                        <button
                            onClick={showPreviousErrors}
                            disabled={currentErrorIndex === 0}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded disabled:opacity-50"
                        >
                            ←
                        </button>
                        <div className="bg-red-100 px-3 py-1 rounded-full text-xs font-medium text-red-700">
                            {currentErrorIndex + 1}-{Math.min(currentErrorIndex + maxVisibleErrors, internalErrors.length)} of {internalErrors.length} errors
                        </div>
                        <button
                            onClick={showNextErrors}
                            disabled={currentErrorIndex + maxVisibleErrors >= internalErrors.length}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded disabled:opacity-50"
                        >
                            →
                        </button>
                    </div>
                )} */}

                {/* Main Error Card */}
                <div className="relative z-10 flex items-center p-4 rounded-lg border text-warning border-warning-light bg-custom-warning">
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
                                        {visibleErrorSlice[0] || 'An error occurred'}
                                    </p>
                                ) : (
                                    <p className="text-sm leading-tight">{visibleErrorSlice[0] || 'An error occurred'}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Show retry button for the currently visible error */}
                            {failedApis.length > 0 && onRetrySpecific ? (
                                // Show retry button for the currently visible error
                                <div 
                                    onClick={() => handleRetrySpecific(failedApis[currentErrorIndex]?.id || failedApis[0].id)}
                                    className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-red-100 px-2 py-1 rounded transition-colors"
                                >
                                    <img 
                                        src="/icons/refresh.svg" 
                                        alt="Retry" 
                                        className="w-4 h-4"
                                    />
                                    <p>Retry {failedApis[currentErrorIndex]?.name || failedApis[0].name}</p>
                                </div>
                            ) : (
                                // Show general retry button only if no specific retry functions and no failedApis
                                showRetry && (onRetry || onClick) && failedApis.length === 0 && (
                                    <div 
                                        onClick={onRetry || onClick}
                                        className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-red-100 px-2 py-1 rounded transition-colors"
                                    >
                                        <img 
                                            src="/icons/refresh.svg" 
                                            alt="Retry" 
                                            className="w-4 h-4"
                                        />
                                        <p>Retry</p>
                                    </div>
                                )
                            )}
                            
                            {/* Always show close button for individual error removal */}
                            <div 
                                onClick={() => handleRemoveError(0)}
                                className="p-1 h-6 w-6 text-sm hover:bg-red-100 rounded-full font-medium cursor-pointer flex items-center justify-center transition-colors duration-200"
                            >
                                <img 
                                    src="/icons/close.svg" 
                                    alt="Close" 
                                    className="w-4 h-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Error;
