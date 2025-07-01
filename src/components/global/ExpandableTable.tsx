import React, { useState } from 'react';
import Table from './Table';

// Define interfaces for BestInfra tablet data
interface MeterReading {
  id: string;
  timestamp: string;
  reading: number;
  consumption: number;
  status: 'normal' | 'high' | 'low' | 'error';
  batteryLevel: number;
  signalStrength: number;
}

interface TabletData {
  id: string;
  tabletId: string;
  tabletName: string;
  location: string;
  meterType: 'energy' | 'water' | 'gas' | 'smart';
  meterNumber: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  lastReading: number;
  lastSync: string;
  batteryLevel: number;
  signalStrength: number;
  firmwareVersion: string;
  readings?: MeterReading[];
  maintenanceHistory?: string[];
  alerts?: string[];
  [key: string]: any; // Allow additional properties for TableData compatibility
}

interface ExpandableTableProps {
  data: TabletData[];
  expandableConfig?: {
    expandField?: string;
    expandLabel?: string;
    getExpandContent: (content: any, row: TabletData) => React.ReactElement;
    onExpand?: (rowId: string) => Promise<any>;
  };
  columns: any[];
  showActions?: boolean;
}

const ExpandableTable: React.FC<ExpandableTableProps> = ({
  data,
  expandableConfig,
  ...tableProps
}) => {
  const {
    expandField = 'expand',
    expandLabel = '',
    getExpandContent,
    onExpand,
  } = expandableConfig || {};

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [expandedContent, setExpandedContent] = useState<Record<string, any>>({});

  const handleToggleExpand = async (rowId: string) => {
    const newExpandedState = !expandedRows[rowId];

    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: newExpandedState,
    }));

    if (newExpandedState && !expandedContent[rowId] && onExpand) {
      try {
        const content = await onExpand(rowId);
        setExpandedContent((prev) => ({
          ...prev,
          [rowId]: content,
        }));
      } catch (error) {
        console.error(`Error loading expanded content for row ${rowId}:`, error);
        setExpandedRows((prev) => ({
          ...prev,
          [rowId]: false,
        }));
      }
    }
  };

  const renderExpandButton = (_value: any, row: any) => {
    const rowId = row.id || row._id;
    const isExpanded = expandedRows[rowId];

    return (
      <button
        className={`w-5 h-5 flex items-center justify-center rounded-full transition-all hover:bg-black/10 dark:hover:bg-white/10`}
        onClick={(e) => {
          e.stopPropagation();
          handleToggleExpand(rowId);
        }}>
        <img
          src={isExpanded ? '/icons/arrow-down.svg' : '/icons/arrow-up.svg'}
          alt={isExpanded ? 'Collapse' : 'Expand'}
          className="w-3.5 h-3.5"
        />
      </button>
    );
  };

  const columns = tableProps.columns
    ? [
        {
          key: expandField,
          label: expandLabel,
          render: renderExpandButton,
        },
        ...tableProps.columns,
      ]
    : [];

  const renderExpandableRow = ({ children, row }: any) => {
    const rowId = row.id || row._id;
    const isExpanded = expandedRows[rowId];
    const content = expandedContent[rowId];

    return (
      <React.Fragment>
        {children}
        {isExpanded && (
          <tr className="bg-gray-50 dark:bg-primary-dark-light">
            <td colSpan={columns.length + (tableProps.showActions ? 1 : 0)}>
              <div className="p-4 rounded bg-blue-50 dark:bg-primary-dark shadow-inner mt-2">
                {getExpandContent && getExpandContent(content, row)}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  return <Table {...tableProps} columns={columns} data={data} rowWrapper={renderExpandableRow} />;
};

export default ExpandableTable;
