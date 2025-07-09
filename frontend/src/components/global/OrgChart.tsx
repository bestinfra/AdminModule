import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

const nodeStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "12px 24px",
  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
  fontWeight: 600,
  color: "#2563eb",
  minWidth: "180px",
  margin: "8px 0"
};

const renderTree = (node: any) => (
  <TreeNode
    label={<div style={nodeStyle}>{node.name}</div>}
    key={node.name}
  >
    {node.children &&
      node.children.map((child: any) => renderTree(child))}
  </TreeNode>
);

const OrgChart = ({ data }: { data: any }) => {
  // Show both GMR and Chennai as roots
  const roots = data[0]?.children || [];
  return (
    <div className="overflow-auto w-full h-full flex items-center justify-center">
      <Tree
        lineWidth={"2px"}
        lineColor={"#cbd5e1"}
        lineBorderRadius={"8px"}
        label={<div></div>}
      >
        {roots.map((node: any) => renderTree(node))}
      </Tree>
    </div>
  );
};

export default OrgChart; 