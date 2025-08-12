import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from '@pages/PageBuilder/ComponentPalette.tsx';
import Canvas from '@pages/PageBuilder/Canvas.tsx';
import GridOptionsModal from '@pages/PageBuilder/GridOptionsModal.tsx';
import type { ComponentType } from '@pages/PageBuilder/types.ts';
import { v4 as uuidv4 } from 'uuid';

const PageBuilder: React.FC = () => {
    const [components, setComponents] = useState<ComponentType[]>([]);
    const [isGridModalOpen, setIsGridModalOpen] = useState(false);
    const [pendingDrop, setPendingDrop] = useState<{
        item: ComponentType;
        index: number;
    } | null>(null);
    const [editingComponent, setEditingComponent] =
        useState<ComponentType | null>(null);

    const deleteComponent = (id: string) => {
        setComponents((prev) => {
            const findAndDeleteComponent = (
                comps: ComponentType[]
            ): ComponentType[] => {
                return comps.filter((comp) => {
                    if (comp.id === id) {
                        return false;
                    }
                    if (comp.children) {
                        comp.children = findAndDeleteComponent(comp.children);
                    }
                    return true;
                });
            };
            return findAndDeleteComponent(prev);
        });
    };

    const handleDrop = (item: ComponentType, parentId: string) => {
        console.log('Drop:', item, parentId);
        const isAlreadyInTarget = components.some(
            (comp) =>
                comp.id === item.id ||
                (comp.children &&
                    comp.children.some((child) => child.id === item.id))
        );

        if (isAlreadyInTarget) {
            console.log('Component already in target, skipping');
            return;
        }

        if (item.type === 'row') {
            console.log('Creating new row');
            setPendingDrop({ item, index: components.length });
            setIsGridModalOpen(true);
        } else {
            console.log('Adding component to parent:', parentId);
            addComponent(item, parentId);
        }
    };

    const addComponent = (item: ComponentType, parentId: string) => {
        console.log('Adding component:', item, 'to parent:', parentId);
        setComponents((prev) => {
            console.log('Previous components:', prev);
            const findAndAddComponent = (
                comps: ComponentType[]
            ): ComponentType[] => {
                return comps.map((comp) => {
                    if (comp.id === parentId) {
                        console.log('Found parent component:', comp);
                        // If the parent is a row, ensure it has children array
                        if (comp.type === 'row' && !comp.children) {
                            comp.children = [];
                        }
                        const isAlreadyChild = comp.children?.some(
                            (child) => child.id === item.id
                        );
                        if (!isAlreadyChild) {
                            const newItem = { ...item, id: uuidv4() };
                            console.log('Adding new item:', newItem);
                            return {
                                ...comp,
                                children: [...(comp.children || []), newItem],
                            };
                        }
                        return comp;
                    }
                    if (comp.children) {
                        return {
                            ...comp,
                            children: findAndAddComponent(comp.children),
                        };
                    }
                    return comp;
                });
            };

            if (parentId === 'root') {
                console.log('Adding to root');
                const isAlreadyInRoot = prev.some(
                    (comp) => comp.id === item.id
                );
                if (!isAlreadyInRoot) {
                    const newItem = { ...item, id: uuidv4() };
                    console.log('Adding new root item:', newItem);
                    return [...prev, newItem];
                }
                return prev;
            }
            const result = findAndAddComponent(prev);
            console.log('Updated components:', result);
            return result;
        });
    };

    const handleGridConfirm = (columns: number) => {
        if (editingComponent) {
            setComponents((prev) => {
                const findAndUpdateComponent = (
                    comps: ComponentType[]
                ): ComponentType[] => {
                    return comps.map((comp) => {
                        if (comp.id === editingComponent.id) {
                            return {
                                ...comp,
                                children: Array(columns)
                                    .fill(null)
                                    .map(() => ({
                                        id: uuidv4(),
                                        type: 'column',
                                    })),
                            };
                        }
                        if (comp.children) {
                            return {
                                ...comp,
                                children: findAndUpdateComponent(comp.children),
                            };
                        }
                        return comp;
                    });
                };
                return findAndUpdateComponent(prev);
            });
            setEditingComponent(null);
        } else if (pendingDrop) {
            const rowComponent: ComponentType = {
                id: uuidv4(),
                type: 'row',
                children: Array(columns)
                    .fill(null)
                    .map(() => ({
                        id: uuidv4(),
                        type: 'column',
                    })),
            };

            setComponents((prev) => [...prev, rowComponent]);
        }
        setPendingDrop(null);
    };

    const handleRowClick = (component: ComponentType) => {
        setEditingComponent(component);
        setIsGridModalOpen(true);
    };

    const handleTextChange = (id: string, text: string) => {
        setComponents((prev) => {
            const findAndUpdateComponent = (
                comps: ComponentType[]
            ): ComponentType[] => {
                return comps.map((comp) => {
                    if (comp.id === id) {
                        return {
                            ...comp,
                            props: {
                                ...comp.props,
                                text,
                            },
                        };
                    }
                    if (comp.children) {
                        return {
                            ...comp,
                            children: findAndUpdateComponent(comp.children),
                        };
                    }
                    return comp;
                });
            };
            return findAndUpdateComponent(prev);
        });
    };

    console.log(components);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen">
                <aside className="w-[300px] bg-white border-r border-gray-200">
                    <ComponentPalette />
                </aside>
                <main className="flex-1 p-6 bg-gray-50">
                    <Canvas
                        components={components}
                        onDrop={handleDrop}
                        onRowClick={handleRowClick}
                        onTextChange={handleTextChange}
                        onDelete={deleteComponent}
                    />
                </main>
            </div>
            <GridOptionsModal
                isOpen={isGridModalOpen}
                onClose={() => {
                    setIsGridModalOpen(false);
                    setPendingDrop(null);
                    setEditingComponent(null);
                }}
                onConfirm={handleGridConfirm}
            />
        </DndProvider>
    );
};

export default PageBuilder;
