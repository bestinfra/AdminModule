import React, { useState } from 'react';
import Page from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';
import type { Section } from '@components/global/Page';


interface ComponentDoc {
  name: string;
  path: string;
  usageCount: string;
  props: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  category: 'most-used' | 'moderately-used' | 'limited-usage' | 'unused';
}

const ComponentsDocumentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentDoc | null>(null);

  // Component data from your markdown file
  const components: ComponentDoc[] = [
    // Most Used Components (10+ imports)
    {
      name: 'Button',
      path: '@components/global/Button',
      usageCount: '15+ imports',
      category: 'most-used',
      props: [
        { name: 'label', type: 'string', description: 'The text displayed on the button' },
        { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'outlineSecondary' | 'primarysmall' | 'success' | 'danger' | 'warning' | 'test' | 'asset'", description: 'Visual style variant of the button' },
        { name: 'size', type: "'small' | 'medium' | 'large'", description: 'Size of the button' },
        { name: 'loading', type: 'boolean', description: 'Shows loading spinner when true' },
        { name: 'children', type: 'React.ReactNode', description: 'React children content' },
        { name: 'icon', type: 'React.ReactNode', description: 'Icon to display alongside text' },
        { name: 'onClick', type: '(event: React.MouseEvent<HTMLButtonElement>) => void', description: 'Click handler function' },
        { name: 'disabled', type: 'boolean', description: 'Disables the button when true' },
        { name: 'type', type: "'button' | 'submit' | 'reset'", description: 'HTML button type' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'Card',
      path: '@components/global/Card',
      usageCount: '12+ imports',
      category: 'most-used',
      props: [
        { name: 'title', type: 'string', description: 'Card title text' },
        { name: 'value', type: 'string | number', description: 'Main value to display' },
        { name: 'icon', type: 'string', description: 'Path to icon image' },
        { name: 'showTrend', type: 'boolean', description: 'Shows trend indicator when true' },
        { name: 'comparisonValue', type: 'number', description: 'Value for trend comparison' },
        { name: 'previousValue', type: 'string', description: 'Previous value for comparison' },
        { name: 'subtitle1', type: 'string', description: 'First subtitle text' },
        { name: 'subtitle2', type: 'string', description: 'Second subtitle text' },
        { name: 'loading', type: 'boolean', description: 'Shows loading state when true' },
        { name: 'onValueClick', type: '() => void', description: 'Click handler for the value' },
        { name: 'iconStyle', type: 'React.CSSProperties', description: 'Custom styles for the icon' }
      ]
    },
    {
      name: 'Table',
      path: '@components/global/Table',
      usageCount: '15+ imports',
      category: 'most-used',
      props: [
        { name: 'data', type: 'TableData[]', description: 'Array of data objects to display' },
        { name: 'columns', type: 'Column[]', description: 'Column configuration array' },
        { name: 'actions', type: 'Action[]', description: 'Action buttons configuration' },
        { name: 'sortable', type: 'boolean', description: 'Enables column sorting' },
        { name: 'searchable', type: 'boolean', description: 'Enables search functionality' },
        { name: 'pagination', type: 'boolean', description: 'Enables pagination' },
        { name: 'rowsPerPageOptions', type: 'number[]', description: 'Available rows per page options' },
        { name: 'initialRowsPerPage', type: 'number', description: 'Initial number of rows per page' },
        { name: 'onRowClick', type: '(row: TableData) => void', description: 'Row click handler' },
        { name: 'onEdit', type: '(row: TableData) => void', description: 'Edit action handler' },
        { name: 'onDelete', type: '(row: TableData) => void', description: 'Delete action handler' },
        { name: 'onView', type: '(row: TableData) => void', description: 'View action handler' },
        { name: 'onPayment', type: '(row: TableData) => void', description: 'Payment action handler' },
        { name: 'loading', type: 'boolean', description: 'Shows loading state' },
        { name: 'emptyMessage', type: 'string', description: 'Message when no data' },
        { name: 'serverPagination', type: 'ServerPagination', description: 'Server-side pagination config' },
        { name: 'onPageChange', type: '(page: number, limit: number) => void', description: 'Page change handler' },
        { name: 'showSkeletonActionButtons', type: 'boolean', description: 'Shows skeleton for action buttons' },
        { name: 'onSearch', type: '(value: string) => void', description: 'Search input handler' },
        { name: 'text', type: 'string', description: 'Additional text' },
        { name: 'showActions', type: 'boolean', description: 'Shows action buttons' },
        { name: 'selectable', type: 'boolean', description: 'Enables row selection' },
        { name: 'selectedRows', type: 'string[]', description: 'Array of selected row IDs' },
        { name: 'onSelectionChange', type: '(selectedIds: string[]) => void', description: 'Selection change handler' },
        { name: 'rowWrapper', type: 'React.ComponentType<{row: TableData; index: number; children: ReactNode}>', description: 'Custom row wrapper component' },
        { name: 'showHeader', type: 'boolean', description: 'Shows table header' },
        { name: 'headerTitle', type: 'string', description: 'Header title text' },
        { name: 'dateRange', type: 'string', description: 'Date range text' },
        { name: 'availableTimeRanges', type: 'string[]', description: 'Available time range options' },
        { name: 'selectedTimeRange', type: 'string', description: 'Currently selected time range' },
        { name: 'onTimeRangeChange', type: '(range: string) => void', description: 'Time range change handler' },
        { name: 'timeRangeLabels', type: 'Record<string, string>', description: 'Custom labels for time ranges' }
      ]
    },
    {
      name: 'Page',
      path: '@components/global/Page',
      usageCount: '12+ imports',
      category: 'most-used',
      props: [
        { name: 'children', type: 'React.ReactNode', description: 'Page content' },
        { name: 'sections', type: 'Section[]', description: 'Page sections configuration' },
        { name: 'title', type: 'string', description: 'Page title' },
        { name: 'subtitle', type: 'string', description: 'Page subtitle' },
        { name: 'actions', type: 'Action[]', description: 'Page action buttons' },
        { name: 'loading', type: 'boolean', description: 'Shows loading state' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'PageHeader',
      path: '@components/global/PageHeader',
      usageCount: '10+ imports',
      category: 'most-used',
      props: [
        { name: 'title', type: 'string', description: 'Header title' },
        { name: 'subtitle', type: 'string', description: 'Header subtitle' },
        { name: 'actions', type: 'React.ReactNode', description: 'Action buttons' },
        { name: 'breadcrumbs', type: 'Breadcrumb[]', description: 'Breadcrumb navigation' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'Dropdown',
      path: '@components/global/Dropdown',
      usageCount: '10+ imports',
      category: 'most-used',
      props: [
        { name: 'name', type: 'string', description: 'Form field name' },
        { name: 'value', type: 'string | string[]', description: 'Selected value(s)' },
        { name: 'onChange', type: '(e: { target: { name: string; value: string | string[] } }) => void', description: 'Change handler' },
        { name: 'options', type: 'Option[]', description: 'Available options array' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
        { name: 'disabled', type: 'boolean', description: 'Disables the dropdown' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'onFocus', type: '() => void', description: 'Focus handler' },
        { name: 'onBlur', type: '() => void', description: 'Blur handler' },
        { name: 'isMultiSelect', type: 'boolean', description: 'Enables multiple selection' },
        { name: 'searchable', type: 'boolean', description: 'Enables search functionality' },
        { name: 'maxHeight', type: 'string', description: 'Maximum height of dropdown' },
        { name: 'groupBy', type: 'string | null', description: 'Group options by field' },
        { name: 'leftIcon', type: 'string | null', description: 'Left icon path' }
      ]
    },
    {
      name: 'Modal',
      path: '@components/global/Modal',
      usageCount: '8+ imports',
      category: 'most-used',
      props: [
        { name: 'isOpen', type: 'boolean', description: 'Controls modal visibility' },
        { name: 'onClose', type: '() => void', description: 'Close handler' },
        { name: 'title', type: 'string', description: 'Modal title' },
        { name: 'showCloseIcon', type: 'boolean', description: 'Shows close button' },
        { name: 'children', type: 'React.ReactNode', description: 'Modal content' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", description: 'Modal size' },
        { name: 'centered', type: 'boolean', description: 'Centers modal vertically' },
        { name: 'backdropClosable', type: 'boolean', description: 'Closes on backdrop click' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
        { name: 'modalId', type: 'string', description: 'Unique modal identifier' },
        { name: 'showConfirmButton', type: 'boolean', description: 'Shows confirm button' },
        { name: 'confirmButtonLabel', type: 'string', description: 'Confirm button text' },
        { name: 'onConfirm', type: '() => void', description: 'Confirm button handler' }
      ]
    },
    // Moderately Used Components (3-9 imports)
    {
      name: 'TimeRangeSelector',
      path: '@components/global/TimeRangeSelector',
      usageCount: '5+ imports',
      category: 'moderately-used',
      props: [
        { name: 'availableTimeRanges', type: 'string[]', description: 'Available time range options' },
        { name: 'selectedTimeRange', type: 'string', description: 'Currently selected time range' },
        { name: 'handleTimeRangeChange', type: '(range: string) => void', description: 'Time range change handler' },
        { name: 'timeRangeLabels', type: 'Record<string, string>', description: 'Custom labels for time ranges' }
      ]
    },
    {
      name: 'Header',
      path: '@components/global/Header',
      usageCount: '5+ imports',
      category: 'moderately-used',
      props: [
        { name: 'title', type: 'string', description: 'Header title' },
        { name: 'onSidebarToggle', type: '() => void', description: 'Sidebar toggle handler' },
        { name: 'onSearch', type: '(query: string) => void', description: 'Search handler' },
        { name: 'actions', type: 'HeaderAction[]', description: 'Header action buttons' },
        { name: 'secondaryLogo', type: 'string', description: 'Secondary logo path' }
      ]
    },
    {
      name: 'FormInput',
      path: '@components/forms/FormInput',
      usageCount: '4+ imports',
      category: 'moderately-used',
      props: [
        { name: 'name', type: 'string', description: 'Form field name' },
        { name: 'label', type: 'string', description: 'Field label' },
        { name: 'type', type: 'string', description: 'Input type' },
        { name: 'value', type: 'any', description: 'Field value' },
        { name: 'onChange', type: '(value: any) => void', description: 'Change handler' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'disabled', type: 'boolean', description: 'Disables the field' },
        { name: 'options', type: 'Option[]', description: 'Options for select inputs' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'LoadingSpinner',
      path: '@components/global/LoadingSpinner',
      usageCount: '4+ imports',
      category: 'moderately-used',
      props: [
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'Form',
      path: '@components/forms/Form',
      usageCount: '3+ imports',
      category: 'moderately-used',
      props: [
        { name: 'config', type: 'FormInputConfig[]', description: 'Form field configurations' },
        { name: 'onSubmit', type: '(values: FormInputValue) => void', description: 'Form submit handler' },
        { name: 'initialValues', type: 'FormInputValue', description: 'Initial form values' },
        { name: 'loading', type: 'boolean', description: 'Shows loading state' },
        { name: 'submitText', type: 'string', description: 'Submit button text' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'Holder',
      path: '@components/global/Holder',
      usageCount: '3+ imports',
      category: 'moderately-used',
      props: [
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
        { name: 'height', type: 'string | number', description: 'Container height' },
        { name: 'title', type: 'string', description: 'Holder title' },
        { name: 'DateRange', type: 'string', description: 'Date range text' },
        { name: 'availableTimeRanges', type: 'string[]', description: 'Available time ranges' },
        { name: 'selectedTimeRange', type: 'string', description: 'Selected time range' },
        { name: 'handleTimeRangeChange', type: '(range: string) => void', description: 'Time range change handler' },
        { name: 'handleDownload', type: '() => void', description: 'Download handler' },
        { name: 'loading', type: 'boolean', description: 'Shows loading state' },
        { name: 'children', type: 'React.ReactNode', description: 'Holder content' }
      ]
    },
    // Limited Usage Components (1-2 imports)
    {
      name: 'Logo',
      path: '@components/global/Logo',
      usageCount: '1-2 imports',
      category: 'limited-usage',
      props: [
        { name: 'width', type: 'number', description: 'Logo width' },
        { name: 'isCollapsed', type: 'boolean', description: 'Shows collapsed state' },
        { name: 'customLogo', type: 'string', description: 'Custom logo path' }
      ]
    },
    {
      name: 'Search',
      path: '@components/global/Search',
      usageCount: '1-2 imports',
      category: 'limited-usage',
      props: [
        { name: 'value', type: 'string', description: 'Search input value' },
        { name: 'onChange', type: '(e: ChangeEvent<HTMLInputElement>) => void', description: 'Change handler' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'onResultClick', type: '(result: SearchResult) => void', description: 'Result click handler' },
        { name: 'results', type: 'SearchResult[]', description: 'Search results' },
        { name: 'isLoading', type: 'boolean', description: 'Shows loading state' },
        { name: 'showShortcut', type: 'boolean', description: 'Shows keyboard shortcut' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
        { name: 'type', type: 'string', description: 'Input type' },
        { name: 'disabled', type: 'boolean', description: 'Disables the input' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string | null', description: 'Error message' },
        { name: 'name', type: 'string', description: 'Input name' }
      ]
    },
    {
      name: 'ProtectedRoute',
      path: '@components/auth/ProtectedRoute',
      usageCount: '1-2 imports',
      category: 'limited-usage',
      props: [
        { name: 'children', type: 'React.ReactNode', description: 'Protected content' },
        { name: 'requiredRole', type: 'string', description: 'Required user role' },
        { name: 'fallback', type: 'React.ReactNode', description: 'Fallback component' }
      ]
    },
    {
      name: 'MainLayout',
      path: '@components/layout/MainLayout',
      usageCount: '1-2 imports',
      category: 'limited-usage',
      props: [
        { name: 'children', type: 'React.ReactNode', description: 'Layout content' },
        { name: 'sidebarCollapsed', type: 'boolean', description: 'Sidebar collapse state' },
        { name: 'onSidebarToggle', type: '() => void', description: 'Sidebar toggle handler' }
      ]
    },
    {
      name: 'Step1',
      path: '@components/AddConsumer/Step1',
      usageCount: '1-2 imports',
      category: 'limited-usage',
      props: [
        { name: 'onNext', type: '() => void', description: 'Next step handler' },
        { name: 'formData', type: 'any', description: 'Form data object' },
        { name: 'onFormDataChange', type: '(data: any) => void', description: 'Form data change handler' }
      ]
    },
    {
      name: 'Step2',
      path: '@components/AddConsumer/Step2',
      usageCount: '1-2 imports',
      category: 'limited-usage',
      props: [
        { name: 'onNext', type: '() => void', description: 'Next step handler' },
        { name: 'onPrevious', type: '() => void', description: 'Previous step handler' },
        { name: 'formData', type: 'any', description: 'Form data object' },
        { name: 'onFormDataChange', type: '(data: any) => void', description: 'Form data change handler' }
      ]
    },
    {
      name: 'Step3',
      path: '@components/AddConsumer/Step3',
      usageCount: '1-2 imports',
      category: 'limited-usage',
      props: [
        { name: 'onSubmit', type: '() => void', description: 'Submit handler' },
        { name: 'onPrevious', type: '() => void', description: 'Previous step handler' },
        { name: 'formData', type: 'any', description: 'Form data object' },
        { name: 'onFormDataChange', type: '(data: any) => void', description: 'Form data change handler' }
      ]
    },
    // Unused Components (0 imports)
    {
      name: 'RecentActivities',
      path: '@components/global/RecentActivities',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'activities', type: 'Activity[]', description: 'Array of recent activities' },
        { name: 'maxItems', type: 'number', description: 'Maximum number of items to show' },
        { name: 'showTimestamp', type: 'boolean', description: 'Shows activity timestamps' },
        { name: 'onActivityClick', type: '(activity: Activity) => void', description: 'Activity click handler' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'ExpandableTable',
      path: '@components/global/ExpandableTable',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'data', type: 'TableData[]', description: 'Array of data objects' },
        { name: 'columns', type: 'Column[]', description: 'Column configuration' },
        { name: 'expandableRows', type: 'boolean', description: 'Enables row expansion' },
        { name: 'expandedContent', type: '(row: TableData) => ReactNode', description: 'Content for expanded rows' },
        { name: 'onRowExpand', type: '(row: TableData) => void', description: 'Row expand handler' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'Tabs',
      path: '@components/global/Tabs',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'tabs', type: 'TabItem[]', description: 'Array of tab items' },
        { name: 'defaultTab', type: 'number', description: 'Default active tab index' },
        { name: 'onTabChange', type: '(index: number) => void', description: 'Tab change handler' },
        { name: 'activeTabIndex', type: 'number', description: 'Currently active tab index' }
      ]
    },
    {
      name: 'Sidebar',
      path: '@components/global/Sidebar',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'menuItems', type: 'MenuItem[]', description: 'Array of menu items' },
        { name: 'collapsed', type: 'boolean', description: 'Sidebar collapse state' },
        { name: 'onItemClick', type: '(item: MenuItem) => void', description: 'Menu item click handler' },
        { name: 'logo', type: 'string', description: 'Logo path' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'CardSkeleton',
      path: '@components/skeletons/CardSkeleton',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
        { name: 'height', type: 'string', description: 'Skeleton height' },
        { name: 'width', type: 'string', description: 'Skeleton width' }
      ]
    },
    {
      name: 'TableSkeleton',
      path: '@components/skeletons/TableSkeleton',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'rows', type: 'number', description: 'Number of skeleton rows' },
        { name: 'columns', type: 'number', description: 'Number of skeleton columns' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'Input',
      path: '@components/forms/Input',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'onSearch', type: '(query: string) => void', description: 'Search handler' },
        { name: 'placeholder', type: 'string', description: 'Search placeholder text' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' },
        { name: 'disabled', type: 'boolean', description: 'Disables the input' },
        { name: 'value', type: 'string', description: 'Input value' }
      ]
    },
    {
      name: 'TextInput',
      path: '@components/forms/renderers/TextInput',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'type', type: 'string', description: 'Input type (text, email, password, etc.)' },
        { name: 'value', type: 'string', description: 'Input value' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'icon', type: 'React.ReactNode', description: 'Input icon' },
        { name: 'name', type: 'string', description: 'Form field name' },
        { name: 'label', type: 'string', description: 'Field label' },
        { name: 'onChange', type: '(value: any) => void', description: 'Change handler' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'disabled', type: 'boolean', description: 'Disables the field' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'TextareaInput',
      path: '@components/forms/renderers/TextareaInput',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'value', type: 'string', description: 'Textarea value' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'rows', type: 'number', description: 'Number of textarea rows' },
        { name: 'name', type: 'string', description: 'Form field name' },
        { name: 'label', type: 'string', description: 'Field label' },
        { name: 'onChange', type: '(value: any) => void', description: 'Change handler' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'disabled', type: 'boolean', description: 'Disables the field' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'SelectInput',
      path: '@components/forms/renderers/SelectInput',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'value', type: 'string', description: 'Selected value' },
        { name: 'options', type: 'Option[]', description: 'Available options' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'name', type: 'string', description: 'Form field name' },
        { name: 'label', type: 'string', description: 'Field label' },
        { name: 'onChange', type: '(value: any) => void', description: 'Change handler' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'disabled', type: 'boolean', description: 'Disables the field' },
        { name: 'isMultiSelect', type: 'boolean', description: 'Enables multiple selection' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'CheckboxInput',
      path: '@components/forms/renderers/CheckboxInput',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'checked', type: 'boolean', description: 'Checkbox checked state' },
        { name: 'label', type: 'string', description: 'Checkbox label' },
        { name: 'name', type: 'string', description: 'Form field name' },
        { name: 'onChange', type: '(value: any) => void', description: 'Change handler' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'disabled', type: 'boolean', description: 'Disables the field' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    },
    {
      name: 'FileInput',
      path: '@components/forms/renderers/FileInput',
      usageCount: '0 imports',
      category: 'unused',
      props: [
        { name: 'value', type: 'File | null', description: 'Selected file' },
        { name: 'accept', type: 'string', description: 'Accepted file types' },
        { name: 'multiple', type: 'boolean', description: 'Allows multiple file selection' },
        { name: 'name', type: 'string', description: 'Form field name' },
        { name: 'label', type: 'string', description: 'Field label' },
        { name: 'onChange', type: '(value: any) => void', description: 'Change handler' },
        { name: 'required', type: 'boolean', description: 'Makes field required' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'disabled', type: 'boolean', description: 'Disables the field' },
        { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes' },
        { name: 'className', type: 'string', description: 'Additional CSS classes' }
      ]
    }
  ];

  // Filter components based on search term
  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.path.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleComponentClick = (component: ComponentDoc) => {
    setSelectedComponent(component);
  };



  // Header component
  const headerComponent = (
    <PageHeader
      title="Components Documentation"
      subtitle="Complete documentation of all components used in the application"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
      buttonsLabel="Export Docs"
      variant="primary"
      onClick={() => console.log('Export documentation')}
      showMenu={false}
      showDropdown={false}
    />
  );

  // Split Layout Section
  const splitLayoutSection: Section = {
    id: 'split-layout',
    component: (
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
        {/* Left Side - Component List */}
        <div className="lg:w-1/3 bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-primary-border dark:border-dark-border">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Component List</h2>
                <p className="text-sm text-neutral mt-1">
                  Showing {filteredComponents.length} of {components.length} components
                </p>
              </div>
              <div className="w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search components by name or path..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-primary-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-primary-dark text-text-primary dark:text-text-primary"
                />
              </div>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            <div className="p-6 space-y-3">
              {filteredComponents.map((component) => (
                <div
                  key={component.name}
                  className={`border border-primary-border dark:border-dark-border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    selectedComponent?.name === component.name 
                      ? 'border-primary bg-primary-lightest dark:bg-primary-dark-light' 
                      : ''
                  }`}
                  onClick={() => handleComponentClick(component)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary">
                          {component.name}
                        </h3>
                      </div>
                      <p className="text-sm text-neutral mt-1 font-mono">
                        {component.path}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-neutral">
                          <strong>Props:</strong> {component.props.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral">
                        Click to view details
                      </span>
                      <svg className="w-5 h-5 text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Component Details */}
        <div className="lg:w-2/3 bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-primary-border dark:border-dark-border">
            <h2 className="text-xl font-semibold">
              {selectedComponent ? `${selectedComponent.name} Details` : 'Select a Component'}
            </h2>
            <p className="text-sm text-neutral mt-1">
              {selectedComponent ? 'Component documentation and props' : 'Click on a component from the list to view its details'}
            </p>
          </div>
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {selectedComponent ? (
              <div className="p-6 space-y-6">
                {/* Component Overview */}
                <div className="bg-primary-lightest dark:bg-primary-dark-light rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-text-primary dark:text-text-primary">Component Name</h4>
                      <p className="text-sm text-neutral">{selectedComponent.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary dark:text-text-primary">Import Path</h4>
                      <p className="text-sm text-neutral font-mono">{selectedComponent.path}</p>
                    </div>
                  </div>
                </div>

                {/* Props Documentation */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-text-primary dark:text-text-primary">
                    Props Documentation
                  </h3>
                  <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl overflow-hidden">
                    <div className="bg-primary-lightest dark:bg-primary-dark-light px-4 py-3 border-b border-primary-border dark:border-dark-border">
                      <div className="grid grid-cols-12 gap-4 font-semibold text-sm">
                        <div className="col-span-3">Prop Name</div>
                        <div className="col-span-4">Type</div>
                        <div className="col-span-5">Description</div>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {selectedComponent.props.map((prop, index) => (
                        <div
                          key={prop.name}
                          className={`px-4 py-3 border-b border-primary-border dark:border-dark-border ${
                            index % 2 === 0 ? 'bg-white dark:bg-primary-dark' : 'bg-gray-50 dark:bg-primary-dark-light'
                          }`}
                        >
                          <div className="grid grid-cols-12 gap-4 text-sm">
                            <div className="col-span-3">
                              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                {prop.name}
                              </code>
                            </div>
                            <div className="col-span-4">
                              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs font-mono break-all">
                                {prop.type}
                              </code>
                            </div>
                            <div className="col-span-5 text-neutral">
                              {prop.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Usage Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-text-primary dark:text-text-primary">
                    Usage Example
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                    <pre>{`import ${selectedComponent.name} from '${selectedComponent.path}';

// Example usage
<${selectedComponent.name}
  ${selectedComponent.props.map(prop => {
    // Generate realistic dummy data based on prop type and name
    let dummyValue = '';
    
    if (prop.type.includes('string')) {
      if (prop.name === 'type') {
        dummyValue = '"text"';
      } else if (prop.name === 'name') {
        dummyValue = '"username"';
      } else if (prop.name === 'label') {
        dummyValue = '"Username"';
      } else if (prop.name === 'placeholder') {
        dummyValue = '"Enter your username"';
      } else if (prop.name === 'className') {
        dummyValue = '"w-full"';
      } else if (prop.name === 'title') {
        dummyValue = '"Total Users"';
      } else if (prop.name === 'value') {
        dummyValue = '"john_doe"';
      } else if (prop.name === 'icon') {
        dummyValue = '"/icons/user.svg"';
      } else if (prop.name === 'error') {
        dummyValue = '"This field is required"';
      } else if (prop.name === 'variant') {
        dummyValue = '"primary"';
      } else if (prop.name === 'size') {
        dummyValue = '"medium"';
      } else {
        dummyValue = '"example"';
      }
    } else if (prop.type.includes('number')) {
      dummyValue = '42';
    } else if (prop.type.includes('boolean')) {
      if (prop.name === 'required') {
        dummyValue = 'true';
      } else if (prop.name === 'disabled') {
        dummyValue = 'false';
      } else if (prop.name === 'loading') {
        dummyValue = 'false';
      } else {
        dummyValue = 'true';
      }
    } else if (prop.type.includes('function') || prop.type.includes('=>')) {
      if (prop.name === 'onChange') {
        dummyValue = 'handleInputChange';
      } else if (prop.name === 'onClick') {
        dummyValue = 'handleClick';
      } else if (prop.name === 'onSubmit') {
        dummyValue = 'handleSubmit';
      } else {
        dummyValue = '() => console.log("clicked")';
      }
    } else if (prop.type.includes('React.ReactNode')) {
      if (prop.name === 'children') {
        dummyValue = '"Button Text"';
      } else if (prop.name === 'icon') {
        dummyValue = '<UserIcon className="w-5 h-5 text-gray-400" />';
      } else {
        dummyValue = '<span>Content</span>';
      }
    } else if (prop.type.includes('[]')) {
      if (prop.name === 'options') {
        dummyValue = '[{ label: "Option 1", value: "1" }, { label: "Option 2", value: "2" }]';
      } else if (prop.name === 'columns') {
        dummyValue = '[{ key: "name", label: "Name" }, { key: "email", label: "Email" }]';
      } else {
        dummyValue = '["item1", "item2"]';
      }
    } else {
      dummyValue = 'null';
    }
    return `${prop.name}={${dummyValue}}`;
  }).join('\n  ')}
/>`}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary mb-2">
                    No Component Selected
                  </h3>
                  <p className="text-neutral">
                    Click on a component from the list to view its documentation and props.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[splitLayoutSection]}
      header={headerComponent}
      sidebarPosition="right"
      className=""
      sectionClassName=""
    />
  );
};

export default ComponentsDocumentation; 