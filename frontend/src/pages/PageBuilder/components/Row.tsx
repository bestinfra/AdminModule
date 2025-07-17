import React from 'react';
import type { ComponentType } from '@pages/PageBuilder/types';
import DroppableArea from '@pages/PageBuilder/components/DroppableArea';
import { renderComponent } from '@pages/PageBuilder/Canvas';

interface RowProps {
    component: ComponentType;
    onRowClick?: (component: ComponentType) => void;
    onTextChange?: (id: string, text: string) => void;
    onDrop: (item: ComponentType, parentId: string) => void;
}

const Row: React.FC<RowProps> = ({
    component,
    onRowClick,
    onTextChange,
    onDrop,
}) => {
    // Ensure we have at least one column if no children exist
    const children = component.children || [{ id: 'default', type: 'column' }];
    const columnCount = children.length;

    return (
        <div
            onClick={() => onRowClick?.(component)}
            className="mb-6 p-2 min-h-[80px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer relative hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white">
            <div
                className="grid h-full"
                style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
                {children.map((child) => (
                    <div key={child.id} className="h-full px-2">
                        <DroppableArea id={child.id} onDrop={onDrop}>
                            {renderComponent({
                                component: child,
                                onRowClick,
                                onTextChange,
                                onDrop,
                            })}
                        </DroppableArea>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Row;
