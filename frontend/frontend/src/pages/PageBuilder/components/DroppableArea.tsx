import React from 'react';
import { useDrop } from 'react-dnd';
import type { ComponentType } from '@pages/PageBuilder/types';

interface DroppableAreaProps {
    id: string;
    onDrop: (item: ComponentType, parentId: string) => void;
    children: React.ReactNode;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({
    id,
    onDrop,
    children,
}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'COMPONENT',
        drop: (item: ComponentType, monitor) => {
            // Only handle the drop if it's directly over this droppable area
            if (monitor.isOver({ shallow: true })) {
                onDrop(item, id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    }));

    return (
        <div
            ref={drop as unknown as React.RefCallback<HTMLDivElement>}
            className={`min-h-[50px] h-full p-2 rounded-md transition-all duration-200 ${
                isOver
                    ? 'bg-blue-50 border-2 border-dashed border-blue-300'
                    : 'bg-transparent border border-dashed border-transparent'
            }`}>
            {children}
        </div>
    );
};

export default DroppableArea;
