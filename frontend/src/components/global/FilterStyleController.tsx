import React from 'react';
import { Select } from 'antd';
import { useFilterStyle, type FilterStyleType } from '@/contexts/FilterStyleContext';

const { Option } = Select;

/**
 * FilterStyleController - Dropdown to change global icon colors
 * 
 * Allows users to change the global icon filter style across the application.
 * Most icons will use this global style, while specific icons can use direct styles.
 */

const FilterStyleController: React.FC = () => {
  const { currentFilterStyle, setFilterStyle, availableStyles } = useFilterStyle();

  // Find the current style key
  const currentStyleKey = Object.keys(availableStyles).find(
    key => availableStyles[key as FilterStyleType].filter === currentFilterStyle.filter
  ) as FilterStyleType;

  const handleStyleChange = (value: FilterStyleType) => {
    setFilterStyle(value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Icon Style:
      </span>
      <Select
        value={currentStyleKey}
        onChange={handleStyleChange}
        style={{ width: 150 }}
        size="small"
      >
        <Option value="BRAND_GREEN">Brand Green</Option>
        <Option value="WHITE">White</Option>
        <Option value="BLUE">Blue</Option>
        <Option value="RED">Red</Option>
      </Select>
    </div>
  );
};

export default FilterStyleController; 