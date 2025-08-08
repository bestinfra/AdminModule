import React, { useState } from 'react';

interface NodeType {
  hierarchy_type_title: string;
  id: number;
  name: string;
  count?: number;
  children?: NodeType[]; // Add support for nested children
  [key: string]: unknown;
}

interface TopLevelHierarchyProps {
  nodes: NodeType[];
  title?: string; // Add dynamic title prop
}

const TopLevelHierarchy: React.FC<TopLevelHierarchyProps> = ({ nodes}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const topLevelGroups = nodes.reduce((acc: Record<string, NodeType[]>, node) => {
    const type = node.hierarchy_type_title;
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {});

  // Recursive component to render nested nodes with connecting lines
  const renderNode = (node: NodeType, level: number = 0, parentKey: string = '', isLastChild: boolean = false) => {
    const nodeKey = `${parentKey}-${node.id}`;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[nodeKey] ?? false;

    return (
      <div key={nodeKey} className="relative">
        <div className={`${level > 0 ? 'ml-6' : ''}`}>
          <div
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 relative ${
              isExpanded ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
            }`}
            onClick={e => {
              e.stopPropagation();
              if (hasChildren) {
                toggleExpand(nodeKey);
              }
            }}
          >
            {/* Left side: arrow + label */}
            <div className="flex items-center gap-2">
              {hasChildren ? (
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
              ) : (
                <span className="w-4 h-4" />
              )}
              <span className={`font-medium ${isExpanded ? 'text-gray-900' : 'text-gray-700'}`}>{node.name}</span>
            </div>

            {/* Right side: count badge */}
            {hasChildren && (
              <span className="inline-flex items-center justify-center w-6 aspect-square text-xs font-medium bg-[var(--color-secondary)] text-white rounded-full">
                {node.children?.length || 0}
              </span>
            )}
            {!hasChildren && node.count != null && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
                {node.count}
              </span>
            )}
          </div>

          {/* Render children recursively with connecting lines */}
          {hasChildren && isExpanded && (
            <div className="relative">
              {/* Vertical line for children container */}
              <span className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></span>
              
              <div className="space-y-2 mt-2">
                {node.children?.map((child, index) => {
                  const isLastChildNode = index === node.children!.length - 1;
                  return (
                    <div key={`${nodeKey}-child-${index}`} className="relative">
                      {/* Horizontal line for each child item */}
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-200 z-20"></span>
                      {renderNode(child, level + 1, nodeKey, isLastChildNode)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl bg-background-secondary">
      {/* Asset List */}
      <div className="p-4 bg-background-secondary h-full">
        {/* Asset Groups */}
        <div className="relative">
          {/* Main vertical line for top-level groups */}
          <span className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></span>
          
          <div className="space-y-3">
            {Object.entries(topLevelGroups).map(([type, groupNodes], groupIndex) => {
              const groupId = `top-${type.replace(/\s+/g, '-').toLowerCase()}`;
              const isExpanded = expandedNodes[groupId] ?? false;

              return (
                <div key={groupId} className="relative">
                  {/* Horizontal line to group */}
                  <span className="absolute left-6 top-6 w-4 h-0.5 bg-gray-200 z-20"></span>
                  
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      isExpanded ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
                    }`}
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
                      <span className={`font-medium ${isExpanded ? 'text-gray-900' : 'text-gray-700'}`}>{type}</span>
                    </div>

                    {/* Right side: round badge */}
                    <span className="inline-flex items-center justify-center w-6 aspect-square text-xs font-medium bg-[var(--color-secondary)] text-white rounded-full">
                      {groupNodes.length}
                    </span>
                  </div>

                  {/* Child nodes with recursive rendering and connecting lines */}
                  {isExpanded && (
                    <div className="relative">
                      {/* Vertical line for children container */}
                      <span className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></span>
                      
                      <div className="space-y-2 mt-2">
                        {groupNodes.map((node, index) => {
                          const isLastChildNode = index === groupNodes.length - 1;
                          return (
                            <div key={`${groupId}-child-${index}`} className="relative">
                              {/* Horizontal line for each child item */}
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-200 z-20"></span>
                              {renderNode(node, 1, groupId, isLastChildNode)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopLevelHierarchy;
