import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import type { ComponentType } from '@components/PageBuilder/types';
import Row from '@components/PageBuilder/components/Row';
import Column from '@components/PageBuilder/components/Column';
import TextBlock from '@components/PageBuilder/components/TextBlock';
import CardBlock from '@components/PageBuilder/components/CardBlock';
import TableBlock from '@components/PageBuilder/components/TableBlock';
import ComponentWrapper from '@components/PageBuilder/components/ComponentWrapper';

interface CanvasProps {
    components: ComponentType[];
    onDrop: (item: ComponentType, parentId: string) => void;
    onRowClick?: (component: ComponentType) => void;
    onTextChange?: (id: string, text: string) => void;
    onDelete?: (id: string) => void;
}

export const renderComponent = ({
    component,
    onRowClick,
    onTextChange,
    onDrop,
    onDelete,
}: {
    component: ComponentType;
    onRowClick?: (component: ComponentType) => void;
    onTextChange?: (id: string, text: string) => void;
    onDrop: (item: ComponentType, parentId: string) => void;
    onDelete?: (id: string) => void;
}) => {
    const renderContent = () => {
        switch (component.type) {
            case 'row':
                return (
                    <Row
                        component={component}
                        onRowClick={onRowClick}
                        onTextChange={onTextChange}
                        onDrop={onDrop}
                    />
                );
            case 'column':
                return (
                    <Column
                        component={component}
                        onRowClick={onRowClick}
                        onTextChange={onTextChange}
                        onDrop={onDrop}
                    />
                );
            case 'text':
                return (
                    <TextBlock
                        component={component}
                        onTextChange={onTextChange}
                    />
                );
            case 'card':
                return <CardBlock component={component} />;
            case 'table':
                return <TableBlock component={component} />;
            default:
                return null;
        }
    };

    return (
        <ComponentWrapper
            key={component.id}
            component={component}
            onDelete={onDelete || (() => {})}>
            {renderContent()}
        </ComponentWrapper>
    );
};

const Canvas: React.FC<CanvasProps> = ({
    components,
    onDrop,
    onRowClick,
    onTextChange,
    onDelete,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'COMPONENT',
        drop: (item: ComponentType, monitor) => {
            if (monitor.isOver({ shallow: true })) {
                onDrop(item, 'root');
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    }));

    drop(ref);

    return (
        <div
            ref={ref}
            className={`min-h-full p-6 rounded-lg border border-dashed border-gray-300 transition-colors duration-200 ${
                isOver ? 'bg-gray-100' : 'bg-white'
            }`}>
            {components.map((component) => (
                <React.Fragment key={component.id}>
                    {renderComponent({
                        component,
                        onRowClick,
                        onTextChange,
                        onDrop,
                        onDelete,
                    })}
                </React.Fragment>
            ))}
            {components.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Drag and drop components here
                </div>
            )}
        </div>
    );
};

export default Canvas;
