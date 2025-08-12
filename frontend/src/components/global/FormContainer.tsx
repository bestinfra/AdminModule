import React from 'react';

interface FormContainerProps {
    children: React.ReactNode;
    className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex-1 min-w-0 ${className}`}>
            {children}
        </div>
    );
};

export default FormContainer; 