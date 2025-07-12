import React, { useState } from "react";
import OrgChart from "../components/global/OrgChart";
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createFooterComponent
} from '../components/global/PageComponents';

const dummyData = [
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

const SidebarTree: React.FC<{ data: any[] }> = ({ data }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="p-4">
      <h2 className="font-bold mb-4 text-base">Location Hierarchy</h2>
      <div className="mb-4">
        <button
          className="flex items-center justify-between w-full rounded-lg px-4 py-2 font-bold text-gray-700 mb-2 focus:outline-none"
          style={{ background: "var(--color-primary-lightest)", boxShadow: "none", border: "none" }}
          onClick={() => setCollapsed((c) => !c)}
        >
          <span>MAIN LOCATION</span>
          <span className="bg-blue-900 text-white text-xs font-bold rounded-full px-2 py-0.5">
            {data.length}
          </span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${collapsed ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {!collapsed && (
          <div className="ml-2">
            {data.map((group) => (
              <div key={group.hierarchy_id} className="mb-4">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <span>{group.hierarchy_name}</span>
                  {group.children && (
                    <span className="bg-blue-900 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {group.children.length}
                    </span>
                  )}
                </div>
                {group.children && (
                  <div className="ml-6 mt-1">
                    {group.children.map((loc: any) => (
                      <div key={loc.hierarchy_id} className="text-gray-700 py-0.5 pl-2">
                        {loc.hierarchy_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function AssetManagement() {
  // Header component
  const headerComponent = createHeaderComponent(
    'Asset Management',
    'Manage and visualize asset hierarchy and organization structure',
    '2 main locations, 14 total assets'
  );

  // Actions component
  const actionsComponent = createActionsComponent([
    { label: 'Add Asset', onClick: () => console.log('Adding new asset...'), variant: 'primary' },
    { label: 'Export Hierarchy', onClick: () => console.log('Exporting hierarchy...'), variant: 'outline' },
    { label: 'Settings', onClick: () => console.log('Opening settings...'), variant: 'outline' }
  ]);



  // Footer component
  const footerComponent = createFooterComponent({
    id: 'Asset Management ID: ASSET-001',
    version: '2.1.0',
    supportLink: '#'
  });

  // Organization Chart Section
  const orgChartSection: Section = {
    id: 'org-chart',
    component: (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border w-full h-full flex items-center justify-center">
          <OrgChart />
        </div>
      </div>
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[orgChartSection]}
      header={headerComponent}
      actions={actionsComponent}
      footer={footerComponent}
      sidebarPosition="left"
      className="min-h-screen"
      sidebarClassName="w-[320px] rounded-2xl m-4 flex-shrink-0"
      sidebar={
        <div
          className="w-full h-full"
          style={{ background: "var(--color-primary-lightest)", boxShadow: "none", border: "none" }}
        >
          <SidebarTree data={dummyData} />
        </div>
      }
    />
  );
} 