import React from 'react';
import Button from '../global/Button';

interface ErrorProps {
    error: boolean | string | null;
    title?: string;
    message?: React.ReactNode;
    onClose?: () => void;
    type?: 'auth' | 'network' | 'validation' | 'server' | 'permission' | 'rateLimit' | 'timeout' | 'database';
}

const Error: React.FC<ErrorProps> = ({ 
    error, 
    title = 'Error', 
    message = 'Something went wrong. Please try again.', 
    onClose, 
    type = 'server' 
}) => {
    if (!error) return null;

    const getErrorStyles = () => {
        const baseStyles = "flex items-center p-4 mb-4 rounded-lg border";
        
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
                return `${baseStyles} text-danger border-danger-light bg-custom-warning`;
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
                return "text-danger";
        }
    };

    return (
        <section className={getErrorStyles()} role="alert" aria-live="polite" aria-atomic="true">
            <header className="flex items-center w-full">
                <main className="flex items-center flex-1">
                    <figure className={`flex-shrink-0 w-5 h-5 ${getIconStyles()}`} aria-hidden="true">
                        <img 
                            src="/icons/error.svg" 
                            alt="Error icon" 
                            className="w-full h-full"
                        />
                    </figure>
                    <div className="ml-3">
                        <h2 className="text-sm font-medium">{title}</h2>
                        <p className="text-sm">{message}</p>
                    </div>
                </main>
                {onClose && (
                    <Button
                        label=""
                        onClick={onClose}
                        variant="outlineSecondary"
                        size="small"
                        className="ml-auto p-1 h-8 w-8 min-w-8"
                        aria-label="Close error message"
                        title="Close error message"
                    >
                        <img 
                            src="/icons/close.svg" 
                            alt="Close" 
                            className="w-5 h-5"
                        />
                    </Button>
                )}
            </header>
        </section>
    );
};

export default Error;
