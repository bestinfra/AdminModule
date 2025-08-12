import React, { useState, useRef, useEffect } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  icon?: string;
  iconColor?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'dash-dot';
  strokeWidth?: number;
  strokeColor?: string;
  interpolation?: 'linear' | 'catmull-rom' | 'bezier-catmull-rom';
  tension?: number;
  edgeStyle?: 'straight' | 'elbow' | 'curved' | 'catmull-rom' | 'spline' | 'arc' | 'step' | 'bezier' | 'polyline';
}

// interface HierarchicalNode {
//   name: string;
//   backgroundColor?: string;
//   borderColor?: string;
//   textColor?: string;
//   icon?: string;
//   [key: string]: any;
// }

// interface HierarchicalData {
//   [key: string]: any;
// }

interface NodeChartProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  data?: any;
  nodes?: Node[];
  edges?: Edge[];
  lines?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  renderNode?: (node: Node, isDragging: boolean) => React.ReactNode;
  enableZoom?: boolean;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  layout?: 'vertical' | 'horizontal';
  EdgeStyleLayout?: 'straight' | 'elbow' | 'curved' | 'catmull-rom' | 'spline' | 'arc' | 'step' | 'bezier' | 'polyline';
}

const initialNodes: Node[] = [
  { id: '1', label: 'Node 1', x: 100, y: 100 },
  { id: '2', label: 'Node 2', x: 300, y: 150 },
  { id: '3', label: 'Node 3', x: 500, y: 100 },
  { id: '4', label: 'Node 4', x: 200, y: 250 },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1', 
    source: '1', 
    target: '2', 
    style: 'dashed', 
    strokeWidth: 2, 
    strokeColor: '#9ca3af',
    interpolation: 'catmull-rom',
    tension: 0.6
  },
  { 
    id: 'e2', 
    source: '2', 
    target: '3', 
    style: 'dashed', 
    strokeWidth: 2, 
    strokeColor: '#9ca3af',
    interpolation: 'catmull-rom',
    tension: 0.6
  },
  { 
    id: 'e3', 
    source: '1', 
    target: '4', 
    style: 'dashed', 
    strokeWidth: 2, 
    strokeColor: '#9ca3af',
    interpolation: 'catmull-rom',
    tension: 0.6
  },
];

function NodeChart({ 
  width = '100%', 
  height = '100%', 
  className = '',
  data,
  nodes: propNodes,
  edges: propEdges,
  lines,
  onNodesChange,
  onEdgesChange,
  renderNode,
  enableZoom = true,
  minZoom = 0.1,
  maxZoom = 3,
  initialZoom = 1,
  layout = 'vertical',
  EdgeStyleLayout = 'curved'
}: NodeChartProps) {
  const convertHierarchicalDataToNodes = (hierarchicalData: any): Node[] => {
    const nodes: Node[] = [];
    
    const processHierarchicalData = (data: any, parentId: string = '', level: number = 0, xOffset: number = 0) => {
      if (!data || typeof data !== 'object') return;
      
      const HORIZONTAL_LEVEL_GAP = 300;
      const VERTICAL_NODE_GAP = 100;
      const LOCATION_VERTICAL_GAP = 150;
      const START_X = 80;
      const START_Y = 60;
      const NODE_HEIGHT = 50;
      
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (item && typeof item === 'object' && item.name) {
            const nodeId = parentId ? `${parentId}-${level}-${index}` : `root-${level}-${index}`;
            
            let nodeX, nodeY;
            
            if (layout === 'horizontal') {
              nodeX = START_X + level * HORIZONTAL_LEVEL_GAP;
              const verticalGap = level === 0 ? LOCATION_VERTICAL_GAP : VERTICAL_NODE_GAP;
              nodeY = START_Y + index * verticalGap;
              nodeX = Math.round(nodeX / 10) * 10;
            } else {
              nodeX = START_X + xOffset + index * 250;
              nodeY = START_Y + level * (NODE_HEIGHT + VERTICAL_NODE_GAP);
            }
            
            const node = {
              id: nodeId,
              label: item.name,
              x: nodeX,
              y: nodeY,
              backgroundColor: item.backgroundColor || '#ffffff',
              borderColor: item.borderColor || '#e0e0e0',
              textColor: item.textColor,
              icon: item.icon || getDefaultIcon()
            };
            
            nodes.push(node);
            
            Object.keys(item).forEach(key => {
              if (key !== 'name' && key !== 'backgroundColor' && key !== 'borderColor' && key !== 'textColor' && key !== 'icon') {
                const nestedData = item[key];
                if (nestedData && (Array.isArray(nestedData) || typeof nestedData === 'object')) {
                  const childX = nodeX + HORIZONTAL_LEVEL_GAP;
                  // const childY = nodeY;
                  const alignedChildX = Math.round(childX / 10) * 10;
                  processHierarchicalData(nestedData, nodeId, level + 1, alignedChildX);
                }
              }
            });
          }
        });
        return;
      }
      
      Object.keys(data).forEach((key, keyIndex) => {
        const value = data[key];
        
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item && typeof item === 'object' && item.name) {
              const nodeId = parentId ? `${parentId}-${key}-${index}` : `${key}-${index}`;
              
              let nodeX, nodeY;
              
              if (layout === 'horizontal') {
                nodeX = START_X + level * HORIZONTAL_LEVEL_GAP;
                const verticalGap = level === 0 ? LOCATION_VERTICAL_GAP : VERTICAL_NODE_GAP;
                nodeY = START_Y + index * verticalGap;
                nodeX = Math.round(nodeX / 10) * 10;
              } else {
                nodeX = START_X + keyIndex * 400 + index * 200;
                nodeY = START_Y + level * (NODE_HEIGHT + VERTICAL_NODE_GAP);
              }
              
              const node = {
                id: nodeId,
                label: item.name,
                x: nodeX,
                y: nodeY,
                backgroundColor: item.backgroundColor || '#ffffff',
                borderColor: item.borderColor || '#e0e0e0',
                textColor: item.textColor,
                icon: item.icon || getDefaultIcon()
              };
              
              nodes.push(node);
              
              Object.keys(item).forEach(nestedKey => {
                if (nestedKey !== 'name' && nestedKey !== 'backgroundColor' && nestedKey !== 'borderColor' && nestedKey !== 'textColor' && nestedKey !== 'icon') {
                  const nestedData = item[nestedKey];
                  if (nestedData && (Array.isArray(nestedData) || typeof nestedData === 'object')) {
                    const childX = nodeX + HORIZONTAL_LEVEL_GAP;
                    // const childY = nodeY;
                    const alignedChildX = Math.round(childX / 10) * 10;
                    processHierarchicalData(nestedData, nodeId, level + 1, alignedChildX);
                  }
                }
              });
            }
          });
        }
      });
    };
    

    
    const getDefaultIcon = (): string => {
      return '';
    };
    
    processHierarchicalData(hierarchicalData);
    
    nodes.forEach((node) => {
      const level = Math.floor(node.x / 300);
      node.x = 80 + level * 300;
      
      const levelNodes = nodes.filter(n => Math.floor(n.x / 300) === level);
      const levelIndex = levelNodes.findIndex(n => n.id === node.id);
      const verticalGap = level === 0 ? 150 : 100;
      node.y = 60 + levelIndex * verticalGap;
      
      node.x = Math.round(node.x / 10) * 10;
      node.y = Math.round(node.y / 10) * 10;
    });
    
    return nodes;
  };

  const getActualNodes = (): Node[] => {
    if (data && typeof data === 'object') {
      const hasHierarchicalStructure = (obj: any): boolean => {
        if (!obj || typeof obj !== 'object') return false;
        if (Array.isArray(obj)) {
          return obj.some(item => hasHierarchicalStructure(item));
        }
        if (obj.name) return true;
        return Object.values(obj).some(value => hasHierarchicalStructure(value));
      };
      
      if (hasHierarchicalStructure(data)) {
        return convertHierarchicalDataToNodes(data);
      } else if (data && 'nodes' in data) {
        return data.nodes;
      }
    } else if (propNodes && typeof propNodes === 'object') {
      const hasHierarchicalStructure = (obj: any): boolean => {
        if (!obj || typeof obj !== 'object') return false;
        if (Array.isArray(obj)) {
          return obj.some(item => hasHierarchicalStructure(item));
        }
        if (obj.name) return true;
        return Object.values(obj).some(value => hasHierarchicalStructure(value));
      };
      
      if (hasHierarchicalStructure(propNodes)) {
        return convertHierarchicalDataToNodes(propNodes);
      } else if (Array.isArray(propNodes)) {
        return propNodes;
      }
    }
    return initialNodes;
  };

  const [nodes, setNodes] = useState<Node[]>(getActualNodes());
  const [edges, setEdges] = useState<Edge[]>(() => {
    if (data && 'edges' in data) {
      return data.edges;
    } else if (data && typeof data === 'object') {
      return propEdges || lines || initialEdges;
    } else {
      return propEdges || lines || initialEdges;
    }
  });
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const draggingNodeId = useRef<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (nodes.length > 0) {
      const autoEdges = generateAutoEdges(nodes);
      setEdges(autoEdges);
      onEdgesChange?.(autoEdges);
    }
  }, [nodes, onEdgesChange]);

  useEffect(() => {
    if (edges.length === 0 && nodes.length > 0) {
      const autoEdges = generateAutoEdges(nodes);
      setEdges(autoEdges);
      onEdgesChange?.(autoEdges);
    }
  }, [nodes.length, edges.length, onEdgesChange]);

  useEffect(() => {
    const newNodes = getActualNodes();
    setNodes(newNodes);
  }, [data, propNodes]);

  const generateAutoEdges = (nodeList: Node[]): Edge[] => {
    const autoEdges: Edge[] = [];
    
    if (nodeList.length <= 1) {
      return autoEdges;
    }
    
    nodeList.forEach((node) => {
      const nodeId = node.id;

      const parts = nodeId.split('-');
      if (parts.length > 1) {
        const possibleParents = [];
        
        possibleParents.push(parts.slice(0, -1).join('-'));
        
        if (parts.length > 2 && !isNaN(Number(parts[parts.length - 1])) && !isNaN(Number(parts[parts.length - 2]))) {
          possibleParents.push(parts.slice(0, -2).join('-'));
        }
        
        for (const parentId of possibleParents) {
          const parentNode = nodeList.find(n => n.id === parentId);
          
          if (parentNode) {
            autoEdges.push({
              id: `edge-${parentId}-${nodeId}`,
              source: parentId,
              target: nodeId,
              style: 'dashed',
              strokeWidth: 2,
              strokeColor: '#9ca3af',
              edgeStyle: EdgeStyleLayout
            });
            break;
          }
        }
      }
    });

    return autoEdges;
  };

  const onMouseDown = (e: React.MouseEvent, node?: Node) => {
    if (node) {
      draggingNodeId.current = node.id;
      offset.current = {
        x: e.clientX - (node.x * zoom + pan.x),
        y: e.clientY - (node.y * zoom + pan.y),
      };
    } else {
      isPanning.current = true;
      panStart.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId.current) {
      const newNodes = nodes.map((node) => {
        if (node.id === draggingNodeId.current) {
          return {
            ...node,
            x: (e.clientX - offset.current.x - pan.x) / zoom,
            y: (e.clientY - offset.current.y - pan.y) / zoom,
          };
        }
        return node;
      });
      setNodes(newNodes);
      onNodesChange?.(newNodes);
    } else if (isPanning.current) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
    }
  };

  const onMouseUp = () => {
    draggingNodeId.current = null;
    isPanning.current = false;
  };

  const findNodeById = (id: string) => nodes.find((n) => n.id === id);

  const getEdgePath = (source: Node, target: Node, zoom: number, pan: { x: number, y: number }, edgeStyle: string = 'curved') => {
    const x1 = (source.x + 75) * zoom + pan.x;
    const y1 = (source.y + 25) * zoom + pan.y;
    const x2 = (target.x + 75) * zoom + pan.x;
    const y2 = (target.y + 25) * zoom + pan.y;
    
    switch (edgeStyle) {
      case 'straight':
        return `M ${x1} ${y1} L ${x2} ${y2}`;
        
      case 'elbow':
        const midX = (x1 + x2) / 2;
        return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
        
      case 'curved':
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cp1x = x1 + dx * 0.5 + dy * 0.2;
        const cp1y = y1 + dy * 0.5 - dx * 0.2;
        return `M ${x1} ${y1} Q ${cp1x} ${cp1y}, ${x2} ${y2}`;
        
      case 'catmull-rom':
        const dx2 = x2 - x1;
        const dy2 = y2 - y1;
        const cp1x2 = x1 + dx2 * 0.33 + dy2 * 0.1;
        const cp1y2 = y1 + dy2 * 0.33 - dx2 * 0.1;
        const cp2x2 = x2 - dx2 * 0.33 + dy2 * 0.1;
        const cp2y2 = y2 - dy2 * 0.33 - dx2 * 0.1;
        return `M ${x1} ${y1} C ${cp1x2} ${cp1y2}, ${cp2x2} ${cp2y2}, ${x2} ${y2}`;
        
      case 'spline':
        const dx3 = x2 - x1;
        const dy3 = y2 - y1;
        const cp1x3 = x1 + dx3 * 0.25 + dy3 * 0.1;
        const cp1y3 = y1 + dy3 * 0.25 - dx3 * 0.1;
        const cp2x3 = x2 - dx3 * 0.25 + dy3 * 0.1;
        const cp2y3 = y2 - dy3 * 0.25 - dx3 * 0.1;
        return `M ${x1} ${y1} C ${cp1x3} ${cp1y3}, ${cp2x3} ${cp2y3}, ${x2} ${y2}`;
        
      case 'arc':
        const dx4 = x2 - x1;
        const dy4 = y2 - y1;
        // const midX4 = (x1 + x2) / 2;
        // const midY4 = (y1 + y2) / 2;
        const radius = Math.sqrt(dx4 * dx4 + dy4 * dy4) / 2;
        const largeArcFlag = Math.abs(dy4) > Math.abs(dx4) ? 1 : 0;
        return `M ${x1} ${y1} A ${radius} ${radius} 0 0 ${largeArcFlag} ${x2} ${y2}`;
        
      case 'step':
        const stepX = x1 + (x2 - x1) * 0.5;
        return `M ${x1} ${y1} L ${stepX} ${y1} L ${stepX} ${y2} L ${x2} ${y2}`;
        
      case 'bezier':
        const dx5 = x2 - x1;
        // const dy5 = y2 - y1;
        const cp1x5 = x1 + dx5 * 0.33;
        const cp1y5 = y1;
        const cp2x5 = x2 - dx5 * 0.33;
        const cp2y5 = y2;
        return `M ${x1} ${y1} C ${cp1x5} ${cp1y5}, ${cp2x5} ${cp2y5}, ${x2} ${y2}`;
        
      case 'polyline':
        const segments = 3;
        let polylinePath = `M ${x1} ${y1}`;
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t;
          polylinePath += ` L ${x} ${y}`;
        }
        return polylinePath;
        
      default:
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
  };

  const getLinearPath = (source: Node, target: Node, zoom: number, pan: { x: number, y: number }) => {
    return getEdgePath(source, target, zoom, pan, 'straight');
  };

  const getCatmullRomPath = (source: Node, target: Node, zoom: number, pan: { x: number, y: number }, _tension: number = 0.5) => {
    return getEdgePath(source, target, zoom, pan, 'spline');
  };

  const getBezierCatmullRomPath = (source: Node, target: Node, zoom: number, pan: { x: number, y: number }, _tension: number = 0.8) => {
    return getEdgePath(source, target, zoom, pan, 'bezier');
  };

  const getFlowingStrokeDasharray = (_edge: Edge, zoom: number) => {
    const dashLength = Math.max(8, 10 * zoom);
    const gapLength = Math.max(4, 5 * zoom);
    const result = `${dashLength},${gapLength}`;
    return result;
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, minZoom));
  };

  const handleZoomReset = () => {
    setZoom(initialZoom);
    setPan({ x: 0, y: 0 });
  };

  const handleFullReset = () => {
    setZoom(initialZoom);
    setPan({ x: 0, y: 0 });
    if (data?.nodes) {
      setNodes(data.nodes);
      onNodesChange?.(data.nodes);
    } else if (propNodes) {
      setNodes(propNodes);
      onNodesChange?.(propNodes);
    } else {
      setNodes(initialNodes);
      onNodesChange?.(initialNodes);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!enableZoom) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * delta));
    setZoom(newZoom);
  };

  return (
    <div
      className={`node-chart ${className}`}
      style={{ 
        width, 
        height, 
        position: 'relative', 
        border: '1px solid var(--border-color, #d1d5db)',
        backgroundColor: 'var(--chart-bg, #f8f9fa)',
        overflow: 'hidden',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        backgroundRepeat: 'repeat'
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseDown={(e) => onMouseDown(e)}
      onWheel={handleWheel}
    >
      <style>
        {`
          @keyframes flow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -30px; }
          }
          
          @keyframes flowBezier {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -40px; }
          }
          
          .flowing-line {
            animation: flow 1.5s linear infinite;
            stroke-dasharray: 10, 5;
          }
          
          .flowing-bezier {
            animation: flowBezier 2s linear infinite;
            stroke-dasharray: 12, 6;
          }

          .metrics-grid {
            background-image: radial-gradient(circle, var(--grid-dot-color, #d1d5db) 1px, transparent 1px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            background-repeat: repeat;
          }

          @media (prefers-color-scheme: dark) {
            .node-chart {
              --chart-bg: #1f2937;
              --grid-dot-color: #4b5563;
              --border-color: #4b5563;
            }
          }

          .node-chart {
            --chart-bg: #f8f9fa;
            --grid-dot-color: #d1d5db;
            --border-color: #d1d5db;
          }
        `}
      </style>

      <div 
        className="metrics-grid"
        style={{
          position: 'absolute',
          top: -1000,
          left: -1000,
          width: 'calc(100% + 2000px)',
          height: 'calc(100% + 2000px)',
          zIndex: 0,
          opacity: 0.8,
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0'
        }}
      />

      {enableZoom && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <button
            onClick={handleZoomIn}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleZoomReset}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            title="Reset Zoom"
          >
            ⌂
          </button>
          <button
            onClick={handleFullReset}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            title="Reset All"
          >
            ⟲
          </button>
        </div>
      )}

      <svg 
        style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {edges.map((edge) => {
          const source = findNodeById(edge.source);
          const target = findNodeById(edge.target);
          if (!source || !target) return null;
          
          const strokeColor = edge.strokeColor || '#9ca3af';
          const strokeWidth = (edge.strokeWidth || 2) * zoom;
          
          const strokeDasharray = getFlowingStrokeDasharray(edge, zoom);
          
          const arrowMarker = strokeColor === '#ef4444' ? 'url(#arrowhead-red)' :
                             strokeColor === '#3b82f6' ? 'url(#arrowhead-blue)' :
                             strokeColor === '#10b981' ? 'url(#arrowhead-green)' :
                             'url(#arrowhead)';
          
          let pathData: string;
          const edgeStyle = edge.edgeStyle || EdgeStyleLayout;
          
          if (edge.interpolation === 'linear') {
            pathData = getLinearPath(source, target, zoom, pan);
          } else if (edge.interpolation === 'catmull-rom') {
            pathData = getCatmullRomPath(source, target, zoom, pan);
          } else if (edge.interpolation === 'bezier-catmull-rom') {
            pathData = getBezierCatmullRomPath(source, target, zoom, pan);
          } else {
            pathData = getEdgePath(source, target, zoom, pan, edgeStyle);
          }

          const animationClass = 'flowing-line';
          
          return (
            <path
              key={edge.id}
              d={pathData}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              markerEnd={arrowMarker}
              className={animationClass}
              fill="none"
            />
          );
        })}
        
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#ef4444"
            />
          </marker>
          <marker
            id="arrowhead-blue"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#3b82f6"
            />
          </marker>
          <marker
            id="arrowhead-green"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#10b981"
            />
          </marker>
        </defs>
      </svg>

      {nodes.map((node) => {
        const isDragging = draggingNodeId.current === node.id;
        
        if (renderNode) {
          return (
            <div
              key={node.id}
              onMouseDown={(e) => onMouseDown(e, node)}
              style={{
                position: 'absolute',
                left: node.x * zoom + pan.x,
                top: node.y * zoom + pan.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                zIndex: 2,
                transform: `scale(${zoom})`,
                transformOrigin: '0 0',
              }}
            >
              {renderNode(node, isDragging)}
            </div>
          );
        }

        const style = {
          backgroundColor: node.backgroundColor,
          borderColor: node.borderColor,
          textColor: node.textColor,
          icon: node.icon
        };
        
        return (
          <div
            key={node.id}
            onMouseDown={(e) => onMouseDown(e, node)}
            style={{
              position: 'absolute',
              left: node.x * zoom + pan.x,
              top: node.y * zoom + pan.y,
              width: Math.max(180, node.label.length * 12) * zoom,
              height: 50 * zoom,
              backgroundColor: style.backgroundColor || '#ffffff',
              border: `${2 * zoom}px solid ${style.borderColor || '#e0e0e0'}`,
              borderRadius: 8 * zoom,
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              boxShadow: `0 ${2 * zoom}px ${4 * zoom}px rgba(0,0,0,0.1)`,
              zIndex: 2,
              transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
              fontWeight: '500',
              fontSize: `${14 * zoom}px`,
              color: style.textColor
            }}
            onMouseEnter={(e) => {
              if (!isDragging) {
                e.currentTarget.style.boxShadow = `0 ${4 * zoom}px ${8 * zoom}px rgba(0,0,0,0.15)`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isDragging) {
                e.currentTarget.style.boxShadow = `0 ${2 * zoom}px ${4 * zoom}px rgba(0,0,0,0.1)`;
              }
            }}
          >
            {style.icon && (
              <span style={{ 
                marginRight: '8px', 
                color: style.textColor,
                fontSize: `${16 * zoom}px`
              }}>
                {style.icon}
              </span>
            )}
            {node.label}
          </div>
        );
      })}
    </div>
  );
}

export default NodeChart;
