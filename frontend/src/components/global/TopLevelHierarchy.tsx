import React, { useState, useRef, useEffect } from "react";

interface MenuItem {
  id: string;
  label: string;
  isDestructive?: boolean;
  link?: string;
}

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
  /** Configurable actions menu items. Defaults to asset management actions if not provided. */
  actions?: MenuItem[];
  /** Callback function when an action is clicked. Receives actionId and the node the action was performed on. */
  onActionClick?: (actionId: string, node: NodeType) => void;
  /** Toggle to show/hide actions menu. Defaults to true. */
  showActions?: boolean;
}

const TopLevelHierarchy: React.FC<TopLevelHierarchyProps> = ({ 
  nodes, 
  actions = [],
  onActionClick,
  showActions = true
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [editMenuPosition, setEditMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [lineHeights, setLineHeights] = useState<Record<string, number>>({});
  const editMenuRef = useRef<HTMLDivElement>(null);
  const dropdownIconRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (e: React.MouseEvent<HTMLSpanElement>, node?: NodeType) => {
    const headerRightRect = e.currentTarget
      .closest('.header-right')
      ?.getBoundingClientRect();

    if (headerRightRect) {
      setEditMenuPosition({
        x: headerRightRect.right - headerRightRect.width - 20,
        y: headerRightRect.bottom + 5,
      });
      setSelectedNode(node || null);
      setShowEditMenu(true);
    }
  };

  const handleMenuItemClick = (itemId: string, node?: NodeType | null) => {
    if (onActionClick && node) {
      onActionClick(itemId, node);
    } else {
      console.log(`${itemId} button clicked for node:`, node?.name);
    }
    setShowEditMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target as Node) &&
        dropdownIconRef.current &&
        !dropdownIconRef.current.contains(event.target as Node)
      ) {
        setShowEditMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Function to measure and update line heights dynamically
  const updateLineHeight = (nodeId: string, contentRef: HTMLDivElement) => {
    if (contentRef) {
      const height = contentRef.scrollHeight;
      setLineHeights(prev => ({ ...prev, [nodeId]: height }));
    }
  };

  const topLevelGroups = nodes.reduce(
    (acc: Record<string, NodeType[]>, node) => {
      const type = node.hierarchy_type_title;
      if (!acc[type]) acc[type] = [];
      acc[type].push(node);
      return acc;
    },
    {}
  );

  // Recursive component to render nested nodes with connecting lines
  const renderNode = (
    node: NodeType,
    level: number = 0,
    parentKey: string = ""
  ) => {
    const nodeKey = `${parentKey}-${node.id}`;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[nodeKey] ?? false;

    return (
      <div key={nodeKey} className="relative">
        <div className={`${level > 0 ? "ml-2" : ""}`}>
          <div
            className={`flex items-center justify-between px-6  py-2 rounded-lg cursor-pointer transition-colors duration-200 relative ${
              isExpanded ? "bg-white shadow-sm" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) {
                toggleExpand(nodeKey);
              }
            }}
          >
            {/* Left side: menu button + label */}
            <div className="flex items-center gap-2">
              <span
                className="flex items-center "
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setEditMenuPosition({
                    x: rect.right - 150,
                    y: rect.bottom + 5,
                  });
                  setSelectedNode(node);
                  setShowEditMenu(true);
                }}
                title="Filter Menu"
              >
                <img 
                  src="/icons/menu-h.svg" 
                  alt="dropdown" 
                  className=""
                />
              </span>
              <span
                className={`font-medium ${
                  isExpanded ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {node.name}
              </span>
              {/* Count badge */}
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
            
            {/* Right side: arrow only */}
            <div className="flex items-center">
              {hasChildren && (
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
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
              )}
            </div>
          </div>

          {/* Render children recursively with connecting lines */}
          {hasChildren && isExpanded && (
            <div className="relative">
              {/* Vertical line that connects all children - dynamic height based on content */}
              <span className="absolute left-12 top-0 w-0.5 bg-gray-200 z-0" style={{ height: `${lineHeights[nodeKey] || (node.children?.length || 0) * 80 - 6}px` }}></span>

              <div 
                className="space-y-4 mt-3"
                ref={(el) => {
                  if (el && isExpanded) {
                    // Use setTimeout to ensure content is rendered before measuring
                    setTimeout(() => updateLineHeight(nodeKey, el), 0);
                  }
                }}
              >
                {node.children?.map((child, index) => {
                  return (
                    <div key={`${nodeKey}-child-${index}`} className="relative">
                      {/* Horizontal line connecting to vertical line */}
                      <span className="absolute left-12 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-200 z-20"></span>
                      {renderNode(child, level + 1, nodeKey)}
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
    <div className="w-full bg-white rounded-3xl bg-background-secondary h-full flex flex-col">
      {/* Asset List */}
      <div className="p-4 bg-background-secondary flex-1 overflow-hidden">
        {/* Asset Groups */}
        <div className="relative h-full overflow-y-auto scrollbar-hide">
          {/* Main vertical line for top-level groups */}

          <div className="space-y-3 pb-4">
            {Object.entries(topLevelGroups).map(([type, groupNodes]) => {
              const groupId = `top-${type.replace(/\s+/g, "-").toLowerCase()}`;
              const isExpanded = expandedNodes[groupId] ?? false;

              return (
                <div key={groupId} className="relative">
                  {/* Removed initial horizontal line */}

                  <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      isExpanded ? "bg-white shadow-sm"  : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(groupId);
                    }}
                  >
                    {/* Left side: arrow + label */}
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
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
                      <span
                        className={`font-medium ${
                          isExpanded ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {type}
                      </span>
                      {/* Right side: round badge */}
                      <span className="inline-flex items-center justify-center w-6 aspect-square text-xs font-medium bg-[var(--color-secondary)] text-white rounded-full">
                        {groupNodes.length}
                      </span>
                    </div>
                    <div className="header-right">
                      <span
                        className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md cursor-pointer"
                        ref={dropdownIconRef}
                        onClick={(e) => handleMenuClick(e, groupNodes[0])}
                        title="Filter Menu"
                      >
                        <img 
                          src="/icons/menu-dots.svg" 
                          alt="dropdown" 
                          className="w-3 h-3 filter dark:invert"
                        />
                      </span>
                    </div>
                  </div>

                  {/* Child nodes with connecting lines */}
                  {isExpanded && (
                    <div className="relative">
                      {/* Vertical line that connects all children - dynamic height based on content */}
                      <span className="absolute left-2 top-0 w-0.5 bg-gray-200 z-0" style={{ height: `${lineHeights[groupId] || 20}px` }}></span>

                      <div 
                        className="space-y-4 mt-3"
                        ref={(el) => {
                          if (el && isExpanded) {
                            // Use setTimeout to ensure content is rendered before measuring
                            setTimeout(() => updateLineHeight(groupId, el), 0);
                          }
                        }}
                      >
                        {groupNodes.map((node, index) => {
                          return (
                            <div
                              key={`${groupId}-child-${index}`}
                              className="relative"
                            >
                              {/* Horizontal line connecting to vertical line */}
                              <span className="absolute left-12 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-200 z-20"></span>
                              {renderNode(node, 1, groupId)}
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
      
      {/* Dropdown Menu */}
      {showEditMenu && showActions && (
        <div
          className="fixed bg-gray-100 dark:bg-gray-800 shadow-lg rounded-2xl min-w-[150px] max-h-[300px] z-50 p-2 flex flex-col animate-fadeIn"
          style={{
            left: editMenuPosition.x,
            top: editMenuPosition.y,
          }}
          ref={editMenuRef}
        >
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {actions.map((item: MenuItem) => (
              <div
                key={item.id}
                className={`px-5 py-3 text-sm cursor-pointer flex items-center gap-3 hover:bg-primary hover:text-white rounded-lg active:bg-primary active:text-white ${
                  item.isDestructive ? 'text-red-600 hover:bg-red-100' : ''
                }`}
                onClick={() => handleMenuItemClick(item.id, selectedNode)}
              >
                {item.label}
              </div>  
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopLevelHierarchy;
