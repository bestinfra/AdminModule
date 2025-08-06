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
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleExpand = (groupId: string) => {
    setExpandedNodes(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const topLevelGroups = nodes.reduce((acc: Record<string, NodeType[]>, node) => {
    const type = node.hierarchy_type_title;
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {});

  return (
    <div className="w-full bg-white rounded-3xl">
      {/* Header */}
      <div className="bg-primary-lightest p-5 flex items-center justify-between p-4 border-b border-primary-border ">
        <div className="flex items-center gap-2">
          <h3 className="font-normal text-base text-main">
            Asset Managements
          </h3>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Asset List */}
      <div className="p-4">
        

        {/* Asset Groups */}
        <div className="">
          {Object.entries(topLevelGroups).map(([type, groupNodes]) => {
            const groupId = `top-${type.replace(/\s+/g, '-').toLowerCase()}`;
            const isExpanded = expandedNodes[groupId] ?? false;

            return (
              <div key={groupId}>
                <div
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={e => {
                    e.stopPropagation();
                    toggleExpand(groupId);
                  }}
                >
                  {/* Left side: arrow + label */}
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="font-medium text-gray-900">{type}</span>
                  </div>

                  {/* Right side: round badge */}
                  <span className="inline-flex items-center justify-center w-6 aspect-square text-xs font-medium bg-[var(--color-secondary)] text-white rounded-full">
  {groupNodes.length}
</span>

                </div>

                {/* Child nodes */}
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {groupNodes.map(node => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                      >
                        <span className="text-sm text-gray-700">{node.name}</span>
                        {node.count != null && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
                            {node.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopLevelHierarchy;
