import React, { useState } from "react";
import OrgChart from '@components/global/OrgChart';
import Modal from '@components/global/Modal';
import Button from '@components/global/Button';

const dummyData = [
  {
    name: 'GMR',
    count: 5,
    children: [
      { name: 'Airborne General Store' },
      { name: 'Neo Travels' },
      { name: 'Mobikins' },
      { name: 'Dormitary' },
      { name: '10 MGW - Solar Plant' },
    ],
  },
  {
    name: 'Chennai',
    count: 3,
    children: [
      {
        name: 'Hyderabad',
        children: [
          { name: 'Hitech City' },
          { name: 'Gachibowli' },
        ],
      },
      { name: 'Egmore' },
      {
        name: 'Vizag',
        children: [
          { name: 'RK Beach' },
          { name: 'Warangal' },
        ],
      },
    ],
  },
];

const AddAssetModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [isSubNode, setIsSubNode] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Asset" size="md" showCloseIcon>
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${tab === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab(0)}
          >
            <span className="text-lg">+</span> Add Asset Name
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${tab === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab(1)}
          >
            <img src="/icons/list.svg" alt="Upload List" className="w-4 h-4" /> Upload List
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${tab === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab(2)}
          >
            <img src="/icons/template.svg" alt="Template" className="w-4 h-4" /> Template
          </button>
        </div>
        {/* Tab Content */}
        {tab === 0 && (
          <>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  className="w-full rounded-full border border-gray-300 px-5 py-3 text-base outline-none focus:border-primary bg-white pr-10"
                  placeholder="Asset Title (Ex. Locations)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <img src="/icons/search.svg" alt="search" className="w-5 h-5 opacity-60" />
                </span>
              </div>
              <input
                className="w-full rounded-full border border-gray-300 px-5 py-3 text-base outline-none focus:border-primary bg-white"
                placeholder="Asset Name (Ex. Hyderabad)"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSubNode}
                  onChange={e => setIsSubNode(e.target.checked)}
                  className="w-5 h-5 accent-primary rounded"
                  id="subnode"
                />
                <label htmlFor="subnode" className="text-gray-500 select-none">
                  Choose an asset below to assign this as a <span className="text-green-600 font-semibold">Sub Node</span>.
                </label>
              </div>
              {isSubNode && (
                <div className="relative">
                  <input
                    className="w-full rounded-full border border-gray-300 px-5 py-3 text-base outline-none focus:border-primary bg-white pr-10"
                    placeholder="Search"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <img src="/icons/search.svg" alt="search" className="w-5 h-5 opacity-60" />
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-4">
              <Button label="Create" variant="primary" />
            </div>
          </>
        )}
        {tab === 1 && (
          <>
            <div className="flex flex-col gap-4">
              <div className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-200 bg-blue-50 rounded-2xl py-10 cursor-pointer">
                <img src="/icons/excel.svg" alt="Excel" className="w-10 h-10 mb-2 opacity-70" />
                <div className="text-gray-600 font-medium">Click to upload or drag and drop</div>
                <div className="text-blue-400 text-sm">.xlsx or .xls files only</div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button label="Create List" variant="primary" />
            </div>
          </>
        )}
        {tab === 2 && (
          <>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  className="w-full rounded-full border border-gray-300 px-5 py-3 text-base outline-none focus:border-primary bg-white pr-28"
                  placeholder="Asset Title (Ex. Locations)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <span className="absolute right-24 top-1/2 -translate-y-1/2">
                  <span className="text-green-500 font-semibold text-sm cursor-pointer">Create New</span>
                </span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <img src="/icons/search.svg" alt="search" className="w-5 h-5 opacity-60" />
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <Button label="Download" variant="primary" />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

const LocationSidebar: React.FC = () => {
  const [mainCollapsed, setMainCollapsed] = useState(false);
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderTree = (nodes: any[], parentKey = '') => (
    <div className="pl-6 border-l-2 border-gray-200 ml-4">
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0;
        const nodeKey = parentKey + node.name;
        return (
          <div key={nodeKey} className="mb-2">
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button
                  className="focus:outline-none"
                  onClick={() => toggleCollapse(nodeKey)}
                >
                  <svg
                    className={`w-4 h-4 mr-1 transition-transform ${collapsed[nodeKey] ? '' : 'rotate-90'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <span className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium text-gray-700">{node.name}</span>
              {node.count && (
                <span className="bg-blue-900 text-white text-xs font-bold rounded-full px-2 py-0.5">{node.count}</span>
              )}
            </div>
            {hasChildren && !collapsed[nodeKey] && (
              <div className="mt-1">
                {renderTree(node.children, nodeKey)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full h-full bg-[#f7fafd] rounded-2xl shadow p-4 flex flex-col" style={{ height: 900, minWidth: 300 }}>
      <div className="font-bold text-base mb-4">Location Hierarchy</div>
      <div>
        <button
          className="flex items-center justify-between w-full rounded-xl px-4 py-2 font-bold text-gray-600 mb-2 focus:outline-none bg-white shadow-sm border border-transparent hover:border-gray-200 transition"
          onClick={() => setMainCollapsed((c) => !c)}
        >
          <span className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 mr-1 transition-transform ${mainCollapsed ? '' : 'rotate-90'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            MAIN LOCATION
          </span>
          <span className="bg-blue-900 text-white text-xs font-bold rounded-full px-2 py-0.5">2</span>
        </button>
        {!mainCollapsed && renderTree(dummyData)}
      </div>
    </div>
  );
};

export default function AssetManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div className="bg-white flex flex-col h-screen overflow-hidden">
      {/* Header and actions */}
      <div className="flex flex-col gap-1 px-8 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
            <p className="text-gray-600 mt-2">Manage and visualize asset hierarchy and organization structure</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">2 main locations, 14 total assets</span>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-lg" onClick={() => setShowAddModal(true)}>Add Asset</button>
            <button className="border border-green-500 text-green-500 font-bold py-2 px-6 rounded-full text-lg bg-white hover:bg-green-50">Export Hierarchy</button>
            <button className="border border-primary text-primary font-bold py-2 px-6 rounded-full text-lg bg-white hover:bg-primary-lightest">Settings</button>
          </div>
        </div>
      </div>
      {/* Main content: sidebar + chart */}
      <div className="flex gap-6 px-8 pb-8" style={{ height: 900 }}>
        {/* Location Hierarchy Sidebar */}
        <div className="w-[320px] flex-shrink-0">
          <LocationSidebar />
        </div>
        {/* Chart area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-[800px] border border-gray-300 rounded-2xl flex items-center justify-center bg-transparent">
            <OrgChart />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <span>Asset Management ID: ASSET-001</span>
          <span>•</span>
          <span>Version: 2.1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Need help?</span>
          <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
        </div>
      </div>
      {/* Add Asset Modal */}
      <AddAssetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
} 