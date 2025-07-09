import React from 'react';
import type { ComponentType } from '../types';
import DroppableArea from './DroppableArea';
import { renderComponent } from '../Canvas';

interface ColumnProps {
    component: ComponentType;
    onRowClick?: (component: ComponentType) => void;
    onTextChange?: (id: string, text: string) => void;
    onDrop: (item: ComponentType, parentId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
    component,
    onRowClick,
    onTextChange,
    onDrop,
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    console.log('Rendering column:', component);

    return (
        <div
            onClick={handleClick}
            className="min-h-[60px] border border-dashed border-gray-200 rounded-md h-full bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
            <DroppableArea id={component.id} onDrop={onDrop}>
                {component.children?.map((child) => (
                    <div key={child.id} className="w-full">
                        {renderComponent({
                            component: child,
                            onRowClick,
                            onTextChange,
                            onDrop,
                        })}
                    </div>
                ))}
            </DroppableArea>
        </div>
    );
};

export default Column;
