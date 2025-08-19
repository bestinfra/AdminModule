import React from 'react';
import type { ComponentType } from '@components/PageBuilder/types';

interface TextBlockProps {
    component: ComponentType;
    onTextChange?: (id: string, text: string) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ component, onTextChange }) => {
    return (
        <div className="hover:bg-white/50 rounded-md transition-all duration-200 border border-gray-200 hover:border-blue-300 group m-3">
            <input
                type="text"
                value={component.props?.text || ''}
                onChange={(e) => onTextChange?.(component.id, e.target.value)}
                placeholder="Enter text here..."
                className="w-full bg-transparent focus:ring-2 focus:ring-blue-400 rounded-md text-gray-700 placeholder-gray-400 group-hover:bg-white/80 min-h-[24px] outline-none p-3"
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-blue-300 rounded-md transition-colors duration-200" />
        </div>
    );
};

export default TextBlock;
