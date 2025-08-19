import React from 'react';
import type { ComponentType } from '@components/PageBuilder/types';

interface ComponentWrapperProps {
    component: ComponentType;
    onDelete: (id: string) => void;
    children: React.ReactNode;
}

const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
    component,
    onDelete,
    children,
}) => {
    return (
        <div className="group relative">
            {children}
            <button
                onClick={() => onDelete(component.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                title="Delete component">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

export default ComponentWrapper;
