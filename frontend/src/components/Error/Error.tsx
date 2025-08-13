import React from 'react';
import Button from '../global/Button';

interface ErrorProps {
    error: boolean | string | null;
    title?: string;
    message?: string;
    onClose?: () => void;
    onRetry?: () => void;
    showRetry?: boolean;
    type?: 'auth' | 'network' | 'validation' | 'server' | 'permission' | 'rateLimit' | 'timeout' | 'database';
    className?: string;
}

const Error: React.FC<ErrorProps> = ({ 
    error, 
    title = 'Connection Error', 
    message = '', 
    onClose, 
    onRetry,
    showRetry = true,
    type = 'network',
    className = ''
}) => {
    if (!error) return null;

    const getErrorStyles = () => {
        const baseStyles = "flex items-center p-4 rounded-lg border shadow-sm";
        
        switch (type) {
            case 'auth':
                return `${baseStyles} text-danger border-danger-light bg-custom-warning`;
            case 'network':
                return `${baseStyles} text-warning border-warning-light bg-custom-warning`;
            case 'validation':
                return `${baseStyles} text-danger border-danger-light bg-custom-warning`;
            case 'server':
                return `${baseStyles} text-danger border-danger-light bg-custom-warning`;
            case 'permission':
                return `${baseStyles} text-warning border-warning-light bg-custom-warning`;
            case 'rateLimit':
                return `${baseStyles} text-warning border-warning-light bg-custom-warning`;
            case 'timeout':
                return `${baseStyles} text-warning border-warning-light bg-custom-warning`;
            case 'database':
                return `${baseStyles} text-danger border-danger-light bg-custom-warning`;
            default:
                return `${baseStyles} text-warning border-warning-light bg-custom-warning`;
        }
    };

    const getIconStyles = () => {
        switch (type) {
            case 'auth':
                return "text-danger";
            case 'network':
                return "text-warning";
            case 'validation':
                return "text-danger";
            case 'server':
                return "text-danger";
            case 'permission':
                return "text-warning";
            case 'rateLimit':
                return "text-warning";
            case 'timeout':
                return "text-warning";
            case 'database':
                return "text-danger";
            default:
                return "text-warning";
        }
    };

    const getIconSrc = () => {
        switch (type) {
            case 'network':
                return "/icons/network-error.svg";
            case 'auth':
                return "/icons/auth-error.svg";
            case 'validation':
                return "/icons/validation-error.svg";
            case 'server':
                return "/icons/server-error.svg";
            case 'permission':
                return "/icons/permission-error.svg";
            case 'rateLimit':
                return "/icons/rate-limit-error.svg";
            case 'timeout':
                return "/icons/timeout-error.svg";
            case 'database':
                return "/icons/database-error.svg";
            default:
                return "/icons/network-error.svg";
        }
    };

    return (
        <section className={`${getErrorStyles()} ${className}`} role="alert" aria-live="polite" aria-atomic="true">
            <div className="flex items-center w-full">
                {/* Left Section - Error Information */}
                <div className="flex items-center flex-1 gap-3">
                    <figure className={`flex-shrink-0 w-5 h-5 ${getIconStyles()}`} aria-hidden="true">
                        <img 
                            src={getIconSrc()} 
                            alt="Error icon" 
                            className="w-full h-full"
                        />
                    </figure>
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold leading-tight">{title}</h2>
                        <p className="text-sm leading-tight mt-0.5">{message}</p>
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3 ml-4">
                    {showRetry && onRetry && (
                        <Button
                            label="Retry"
                            onClick={onRetry}
                            variant="outlineSecondary"
                            size="small"
                            className="flex items-center gap-2 text-sm font-medium hover:underline bg-transparent border-none p-0 h-auto"
                            aria-label="Retry connection"
                            title="Retry connection"
                        >
                                                    <img 
                            src="/icons/arrow-up.svg" 
                            alt="Retry" 
                            className="w-4 h-4 transform rotate-45"
                        />
                            Retry
                        </Button>
                    )}
                    
                    {onClose && (
                        <Button
                            label=""
                            onClick={onClose}
                            variant="outlineSecondary"
                            size="small"
                            className="p-1 h-6 w-6 min-w-6 text-sm font-medium hover:bg-gray-100 rounded bg-transparent border-none"
                            aria-label="Close error message"
                            title="Close error message"
                        >
                            ×
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Error;
