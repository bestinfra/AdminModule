import React, { useMemo } from 'react';
import Tree from 'react-d3-tree';
// import '@/styles/custom.css';

interface HierarchyNode {
    hierarchy_id: string | number;
    hierarchy_name: string;
    hierarchy_type_title: string;
    level?: number;
    icon?: string;
    children?: HierarchyNode[];
}

interface OrgChartAltProps {
    data?: HierarchyNode[];
    height?: string;
    className?: string;
    loading?: boolean;
}

// Helper to transform HierarchyNode[] to react-d3-tree format
function toD3Tree(nodes: HierarchyNode[]): any[] {
    // If already nested, just map to the right keys
    return nodes.map((node) => ({
        name: node.hierarchy_name,
        attributes: {
            type: node.hierarchy_type_title,
            id: node.hierarchy_id,
        },
        children: node.children ? toD3Tree(node.children) : undefined,
    }));
}

const OrgChartAlt: React.FC<OrgChartAltProps> = ({
    data = [],
    height = '100%',
    className,
    loading = false,
}) => {
    // Memoize the transformation for performance
    const treeData = useMemo(() => toD3Tree(data), [data]);

    return (
        <div
            className={`w-full h-full ${className || ''}`}
            style={{
                height,
                minHeight: 300,
                background: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
            }}>
            {loading ? (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <Tree
                    data={treeData}
                    orientation="horizontal"
                    translate={{ x: 200, y: 200 }}
                    collapsible={true}
                    zoomable={true}
                    separation={{ siblings: 1.5, nonSiblings: 2 }}
                    pathFunc="elbow"
                    rootNodeClassName="orgchart-root-node"
                    branchNodeClassName="orgchart-branch-node"
                    leafNodeClassName="orgchart-leaf-node"
                    // To style nodes/links, use the above classNames in your CSS
                />
            )}
        </div>
    );
};

export default OrgChartAlt;
