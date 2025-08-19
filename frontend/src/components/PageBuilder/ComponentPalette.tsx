import React from 'react';
import { Card } from 'antd';
import { useDrag } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

const ComponentItem: React.FC<{ type: string; label: string }> = ({
    type,
    label,
}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'COMPONENT',
        item: { id: uuidv4(), type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag as unknown as React.RefCallback<HTMLDivElement>}
            className={`opacity-${isDragging ? '50' : '100'} cursor-move mb-2`}>
            <Card
                size="small"
                hoverable
                className="hover:shadow-md transition-shadow duration-200">
                {label}
            </Card>
        </div>
    );
};

const ComponentPalette: React.FC = () => {
    const components = [
        { type: 'row', label: 'Row' },
        { type: 'column', label: 'Column' },
        { type: 'text', label: 'Text Block' },
        { type: 'card', label: 'Card' },
        { type: 'table', label: 'Table' },
    ];

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Components
            </h3>
            <div className="space-y-2">
                {components.map((comp) => (
                    <ComponentItem
                        key={comp.type}
                        type={comp.type}
                        label={comp.label}
                    />
                ))}
            </div>
        </div>
    );
};

export default ComponentPalette;
