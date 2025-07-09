import React from "react";
import OrgChart from "../components/global/OrgChart";

interface ChildNode {
  name: string;
  children?: ChildNode[];
}
interface LocationNode extends ChildNode {
  count?: number;
}
interface HierarchyGroup {
  type: string;
  count: number;
  children: LocationNode[];
}

const dummyHierarchy: HierarchyGroup[] = [
  {
    type: "MAIN LOCATION",
    count: 2,
    children: [
      {
        name: "GMR",
        count: 5,
        children: [
          { name: "Airborne General Store" },
          { name: "Neo Travels" },
          { name: "Mobikins" },
          { name: "Dormitary" },
          { name: "10 MGW - Solar Plant" }
        ]
      },
      {
        name: "Chennai",
        count: 3,
        children: [
          {
            name: "Hyderabad",
            children: [
              { name: "Hitech City" },
              { name: "Gachibowli" }
            ]
          },
          { name: "Egmore" },
          {
            name: "Vizag",
            children: [
              { name: "RK Beach" },
              { name: "Warangal" }
            ]
          }
        ]
      }
    ]
  }
];

const SidebarTree: React.FC<{ data: HierarchyGroup[] }> = ({ data }) => (
  <div className="p-4">
    <h2 className="font-bold mb-4 text-base">Location Hierarchy</h2>
    {data.map((group) => (
      <div key={group.type} className="mb-4">
        <div className="flex items-center justify-between bg-[#f4f7fa] rounded-lg px-4 py-2 font-bold text-gray-700 mb-2 shadow-sm">
          <span>{group.type}</span>
          <span className="bg-blue-900 text-white text-xs font-bold rounded-full px-2 py-0.5">
            {group.count}
          </span>
        </div>
        <div className="ml-2">
          {group.children.map((loc) => (
            <div key={loc.name} className="mb-2">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <span>{loc.name}</span>
                {loc.count && (
                  <span className="bg-blue-900 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {loc.count}
                  </span>
                )}
              </div>
              {loc.children && (
                <div className="ml-6 border-l border-gray-200 pl-3 mt-1">
                  {loc.children.map((child) => (
                    <div key={child.name} className="text-gray-700 py-0.5 pl-2">
                      {child.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const AssetManagement = () => {
  return (
    <div className="min-h-screen bg-[#f6f8fa]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <button className="flex items-center text-base font-semibold text-gray-700 hover:underline">
            <span className="mr-1 text-xl">&larr;</span>
            Back to Dashboard
          </button>
          <span className="text-2xl font-bold ml-4">Assets</span>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow transition text-lg">
          Add Asset
        </button>
      </div>
      <div className="flex gap-4 px-5 pb-5">
        {/* Sidebar */}
        <div className="w-[320px]">
          <div className="bg-white rounded-2xl shadow border p-0 mt-2">
            <SidebarTree data={dummyHierarchy} />
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow border h-[80vh] mt-2 flex items-center justify-center">
            <OrgChart data={dummyHierarchy} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManagement; 