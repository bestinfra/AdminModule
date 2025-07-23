import React, { useState } from 'react';

interface NodeType {
    hierarchy_type_title: string;
    id: number;
    name: string;
    count?: number;
    [key: string]: unknown;
}

interface TopLevelHierarchyProps {
    nodes: NodeType[];
}

const TopLevelHierarchy: React.FC<TopLevelHierarchyProps> = ({ nodes }) => {
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
        {}
    );

    const toggleExpand = (groupId: string) => {
        setExpandedNodes((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const topLevelGroups = nodes.reduce(
        (acc: Record<string, NodeType[]>, node) => {
            const type = node.hierarchy_type_title;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(node);
            return acc;
        },
        {} as Record<string, NodeType[]>
    );

    return (
        <div className="w-full bg-[#f7fafd] rounded-2xl py-2 px-0">
            {Object.keys(topLevelGroups).map((type) => {
                const groupNodes = topLevelGroups[type];
                const groupId = `top-${type
                    .replace(/\s+/g, '-')
                    .toLowerCase()}`;
                const isExpanded = expandedNodes[groupId] ?? true;

                return (
                    <div key={groupId} className="mb-2">
                        <div
                            className={
                                `flex items-center justify-between bg-white rounded-lg shadow px-4 py-2 border border-[#e5eaf2] ml-2 cursor-pointer select-none` +
                                (isExpanded ? ' mb-2' : '')
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(groupId);
                            }}>
                            <div className="flex items-center gap-2">
                                <span className="transition-transform">
                                    <img
                                        src={
                                            isExpanded
                                                ? 'icons/arrow-down.svg'
                                                : 'icons/arrow-up.svg'
                                        }
                                        alt={isExpanded ? 'Collapse' : 'Expand'}
                                        className={`w-4 h-4 ${
                                            isExpanded ? '' : 'rotate-180'
                                        }`}
                                    />
                                </span>
                                <span className="font-semibold text-gray-800 text-base">
                                    {type}
                                </span>
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#173a71] text-white font-semibold">
                                    {groupNodes.length}
                                </span>
                            </div>
                        </div>
                        {isExpanded && (
                            <div className="pl-8 border-l-2 border-[#e5eaf2] ml-4 mt-2 space-y-2">
                                {groupNodes.map((node) => (
                                    <div
                                        key={node.id}
                                        className="flex items-center gap-2">
                                        <span className="font-medium text-gray-600 text-sm">
                                            {node.name}
                                        </span>
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#173a71] text-white font-semibold">
                                            {node.count ?? 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TopLevelHierarchy;
