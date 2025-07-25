import React, { useMemo } from 'react';
import Tree from 'react-d3-tree';

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
                    styles={{
                        nodes: {
                            node: {
                                circle: { fill: '#2563eb', r: 10 },
                                name: { fontSize: '1rem', fill: '#1e293b' },
                                attributes: {
                                    fontSize: '0.8rem',
                                    fill: '#64748b',
                                },
                            },
                            leafNode: {
                                circle: { fill: '#38bdf8', r: 10 },
                                name: { fontSize: '1rem', fill: '#0f172a' },
                                attributes: {
                                    fontSize: '0.8rem',
                                    fill: '#64748b',
                                },
                            },
                        },
                        links: {
                            stroke: '#94a3b8',
                            strokeWidth: 2,
                        },
                    }}
                />
            )}
        </div>
    );
};

export default OrgChartAlt;
