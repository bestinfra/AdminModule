
/**
 * Organization Chart Component (Tailwind CSS Version)
 * 
 * A hierarchical visualization of an organization's structure using ReactFlow.
 * This component creates an interactive organization chart with different levels
 * of hierarchy and their relationships.
 */

import React from "react";
import ReactFlow, { Position, Background, Controls } from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

interface OrgChartNode {
  hierarchy_id: string;
  hierarchy_name: string;
  hierarchy_type_title: string;
  children?: OrgChartNode[];
}

// Dummy data as per your screenshot
const dummyData: OrgChartNode[] = [
  {
    hierarchy_id: '1',
    hierarchy_name: 'GMR',
    hierarchy_type_title: 'Main Location',
    children: [
      { hierarchy_id: '2', hierarchy_name: 'Airborne General Store', hierarchy_type_title: 'Meter Location' },
      { hierarchy_id: '3', hierarchy_name: 'Neo Travels', hierarchy_type_title: 'Meter Location' },
      { hierarchy_id: '4', hierarchy_name: 'Mobikins', hierarchy_type_title: 'Meter Location' },
      { hierarchy_id: '5', hierarchy_name: 'Dormitary', hierarchy_type_title: 'Meter Location' },
      { hierarchy_id: '6', hierarchy_name: '10 MGW - Solar Plant', hierarchy_type_title: 'Meter Location' },
    ],
  },
  {
    hierarchy_id: '7',
    hierarchy_name: 'Chennai',
    hierarchy_type_title: 'Main Location',
    children: [
      {
        hierarchy_id: '8',
        hierarchy_name: 'Hyderabad',
        hierarchy_type_title: 'Main Location',
        children: [
          { hierarchy_id: '9', hierarchy_name: 'Hitech City', hierarchy_type_title: 'Meter Location' },
          { hierarchy_id: '10', hierarchy_name: 'Gachibowli', hierarchy_type_title: 'Meter Location' },
        ],
      },
      { hierarchy_id: '11', hierarchy_name: 'Egmore', hierarchy_type_title: 'Meter Location' },
      {
        hierarchy_id: '12',
        hierarchy_name: 'Vizag',
        hierarchy_type_title: 'Main Location',
        children: [
          { hierarchy_id: '13', hierarchy_name: 'RK Beach', hierarchy_type_title: 'Meter Location' },
          { hierarchy_id: '14', hierarchy_name: 'Warangal', hierarchy_type_title: 'Meter Location' },
        ],
      },
    ],
  },
];

// Helper to compute subtree height
const computeSubtreeHeight = (node: OrgChartNode): number => {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum: number, child: OrgChartNode) => sum + computeSubtreeHeight(child), 0);
};

// Convert hierarchical data to ReactFlow nodes and edges
const getNodesAndEdges = (data: OrgChartNode[]): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const childSpacing = 60;
  const horizontalSpacing = 370;

  const createNode = (item: OrgChartNode, x: number, y: number): void => {
    const nodeType = (item.hierarchy_type_title || "main-location").toLowerCase().replace(/\s+/g, '-');
    nodes.push({
      id: `${item.hierarchy_id}`,
      data: { label: item.hierarchy_name || '' }, // Always provide a label
      position: { x, y },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        backgroundColor: nodeType === 'main-location' ? '#e3f2fd' : '#f8f9fa',
        border: nodeType === 'main-location' ? '1px solid #90caf9' : '1px solid #E5E5E5',
        color: nodeType === 'main-location' ? '#163b7c' : '#424242',
        fontWeight: nodeType === 'main-location' ? 'bold' : 'normal',
        minWidth: 120,
        maxWidth: 220,
        fontFamily: 'Manrope, sans-serif',
        fontSize: '0.9rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
      },
    });
  };

  const processNode = (item: OrgChartNode, x: number, y: number): void => {
    const subtreeHeight = computeSubtreeHeight(item);
    const nodeY = y + (subtreeHeight * childSpacing) / 2 - childSpacing / 2;
    createNode(item, x, nodeY);
    if (item.children && item.children.length > 0) {
      let childY = y;
      item.children.forEach((child: OrgChartNode) => {
        const childSubtreeHeight = computeSubtreeHeight(child);
        edges.push({
          id: `e${item.hierarchy_id}-${child.hierarchy_id}`,
          source: `${item.hierarchy_id}`,
          target: `${child.hierarchy_id}`,
          type: 'bezier',
          animated: true,
          style: {
            stroke: '#b0b8c1',
            strokeWidth: 2,
          },
          markerEnd: undefined,
        });
        processNode(child, x + horizontalSpacing, childY);
        childY += childSubtreeHeight * childSpacing;
      });
    }
  };

  let currentY = 0;
  data.forEach((item: OrgChartNode) => {
    const subtreeHeight = computeSubtreeHeight(item);
    processNode(item, 0, currentY);
    currentY += subtreeHeight * childSpacing + 40;
  });

  return { nodes, edges };
};

const OrgChart: React.FC = () => {
  const { nodes, edges } = getNodesAndEdges(dummyData);

  return (
    <div className="w-full h-[700px] bg-white rounded-2xl min-h-[600px] flex items-center justify-center">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        minZoom={0.1}
        maxZoom={2}
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: true,
          minZoom: 0.1,
          maxZoom: 2,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={2} color="#b0b8c1" />
        <Controls position="bottom-left" />
      </ReactFlow>
    </div>
  );
};

export default OrgChart; 