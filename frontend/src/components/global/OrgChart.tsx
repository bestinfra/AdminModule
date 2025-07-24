import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    ReactFlowProvider,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';

interface HierarchyNode {
    hierarchy_id: string | number;
    hierarchy_name: string;
    hierarchy_type_title: string;
    level?: number;
    icon?: string;
    children?: HierarchyNode[];
}

interface OrgChartProps {
    data?: HierarchyNode[];
    height?: string;
    className?: string;
    loading?: boolean;
}

const OrgChart = ({
    data = [],
    height = '100%',
    className,
    loading = false,
}: OrgChartProps) => {
    const chartRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const computeSubtreeHeight = (node: HierarchyNode): number => {
        if (!node.children || node.children.length === 0) return 1;
        return node.children.reduce(
            (sum: number, child: HierarchyNode) =>
                sum + computeSubtreeHeight(child),
            0
        );
    };

    const generateNodes = () => {
        const nodes: Node[] = [];
        const nodeMap = new Map();
        const childSpacing = 60;
        const horizontalSpacing = 370;

        const createNode = (item: HierarchyNode, x: number, y: number) => {
            const node = {
                id: `${item.hierarchy_id}`,
                data: {
                    label: item.hierarchy_name,
                    type: item.hierarchy_type_title
                        .toLowerCase()
                        .replace(/\s+/g, '-'),
                    title: item.hierarchy_type_title,
                    name: item.hierarchy_name,
                    level: item.level || 0,
                    icon: item.icon,
                },
                position: { x, y },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                draggable: false,
                className: `rounded-lg shadow-md bg-white border border-gray-200 px-4 py-2 text-center text-xs font-medium`,
            };
            nodeMap.set(item.hierarchy_id, node);
            nodes.push(node);
            return node;
        };

        const processNode = (item: HierarchyNode, x: number, y: number) => {
            const subtreeHeight = computeSubtreeHeight(item);
            const nodeY =
                y + (subtreeHeight * childSpacing) / 2 - childSpacing / 2;
            createNode(item, x, nodeY);
            if (item.children && item.children.length > 0) {
                let childY = y;
                item.children.forEach((child: HierarchyNode) => {
                    const childSubtreeHeight = computeSubtreeHeight(child);
                    processNode(child, x + horizontalSpacing, childY);
                    childY += childSubtreeHeight * childSpacing;
                });
            }
        };

        let currentY = 0;
        data.forEach((item: HierarchyNode) => {
            const subtreeHeight = computeSubtreeHeight(item);
            processNode(item, 0, currentY);
            currentY += subtreeHeight * childSpacing + 40;
        });

        return nodes;
    };

    const generateEdges = () => {
        const edges: Edge[] = [];
        const processNode = (item: HierarchyNode) => {
            if (item.children && item.children.length > 0) {
                item.children.forEach((child: HierarchyNode) => {
                    edges.push({
                        id: `e${item.hierarchy_id}-${child.hierarchy_id}`,
                        source: `${item.hierarchy_id}`,
                        target: `${child.hierarchy_id}`,
                        animated: true,
                        className: 'stroke-blue-400',
                    });
                    processNode(child);
                });
            }
        };
        data.forEach(processNode);
        return edges;
    };

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (data && data.length > 0) {
            setNodes(generateNodes());
            setEdges(generateEdges());
        }
    }, [data]);

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: 'smoothstep',
                        className: 'stroke-blue-400',
                    },
                    eds
                )
            ),
        [setEdges]
    );

    return (
        <div
            className={`w-full ${className || ''}`}
            style={{ height, fontFamily: 'Manrope, sans-serif' }}>
            <div
                className="w-full h-full bg-gray-50 rounded-lg border border-gray-200 overflow-auto"
                ref={containerRef}>
                {loading ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <ReactFlowProvider>
                        <ReactFlow
                            ref={chartRef}
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            fitView
                            className="w-full h-full"
                            minZoom={0.1}
                            maxZoom={2}
                            fitViewOptions={{
                                padding: 0.1,
                                includeHiddenNodes: true,
                                minZoom: 0.1,
                                maxZoom: 2,
                            }}>
                            <MiniMap className="!bg-gray-100 !border !border-gray-300" />
                            <Controls className="!bg-white !border !border-gray-300" />
                            <Background className="!bg-gray-50" />
                        </ReactFlow>
                    </ReactFlowProvider>
                )}
            </div>
        </div>
    );
};

export default OrgChart;
