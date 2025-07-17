# Used Components - Detailed Props Documentation

## 📋 COMPONENTS THAT ARE ACTUALLY USED

### ✅ MOST USED COMPONENTS (10+ imports)

#### 1. Button (`@components/global/Button`)

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | The text displayed on the button |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'outlineSecondary' \| 'primarysmall' \| 'success' \| 'danger' \| 'warning' \| 'test' \| 'asset'` | Visual style variant of the button |
| `size` | `'small' \| 'medium' \| 'large'` | Size of the button |
| `loading` | `boolean` | Shows loading spinner when true |
| `children` | `React.ReactNode` | React children content |
| `icon` | `React.ReactNode` | Icon to display alongside text |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | Click handler function |
| `disabled` | `boolean` | Disables the button when true |
| `type` | `'button' \| 'submit' \| 'reset'` | HTML button type |
| `className` | `string` | Additional CSS classes |

**Usage Count:** 15+ imports

#### 2. Card (`@components/global/Card`)

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title text |
| `value` | `string \| number` | Main value to display |
| `icon` | `string` | Path to icon image |
| `showTrend` | `boolean` | Shows trend indicator when true |
| `comparisonValue` | `number` | Value for trend comparison |
| `previousValue` | `string` | Previous value for comparison |
| `subtitle1` | `string` | First subtitle text |
| `subtitle2` | `string` | Second subtitle text |
| `loading` | `boolean` | Shows loading state when true |
| `onValueClick` | `() => void` | Click handler for the value |
| `iconStyle` | `React.CSSProperties` | Custom styles for the icon |

**Usage Count:** 12+ imports

#### 3. Table (`@components/global/Table`)

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TableData[]` | Array of data objects to display |
| `columns` | `Column[]` | Column configuration array |
| `actions` | `Action[]` | Action buttons configuration |
| `sortable` | `boolean` | Enables column sorting |
| `searchable` | `boolean` | Enables search functionality |
| `pagination` | `boolean` | Enables pagination |
| `rowsPerPageOptions` | `number[]` | Available rows per page options |
| `initialRowsPerPage` | `number` | Initial number of rows per page |
| `onRowClick` | `(row: TableData) => void` | Row click handler |
| `onEdit` | `(row: TableData) => void` | Edit action handler |
| `onDelete` | `(row: TableData) => void` | Delete action handler |
| `onView` | `(row: TableData) => void` | View action handler |
| `onPayment` | `(row: TableData) => void` | Payment action handler |
| `loading` | `boolean` | Shows loading state |
| `emptyMessage` | `string` | Message when no data |
| `serverPagination` | `ServerPagination` | Server-side pagination config |
| `onPageChange` | `(page: number, limit: number) => void` | Page change handler |
| `showSkeletonActionButtons` | `boolean` | Shows skeleton for action buttons |
| `onSearch` | `(value: string) => void` | Search input handler |
| `text` | `string` | Additional text |
| `showActions` | `boolean` | Shows action buttons |
| `selectable` | `boolean` | Enables row selection |
| `selectedRows` | `string[]` | Array of selected row IDs |
| `onSelectionChange` | `(selectedIds: string[]) => void` | Selection change handler |
| `rowWrapper` | `React.ComponentType<{row: TableData; index: number; children: ReactNode}>` | Custom row wrapper component |
| `showHeader` | `boolean` | Shows table header |
| `headerTitle` | `string` | Header title text |
| `dateRange` | `string` | Date range text |
| `availableTimeRanges` | `string[]` | Available time range options |
| `selectedTimeRange` | `string` | Currently selected time range |
| `onTimeRangeChange` | `(range: string) => void` | Time range change handler |
| `timeRangeLabels` | `Record<string, string>` | Custom labels for time ranges |

**Usage Count:** 15+ imports

#### 4. Page (`@components/global/Page`)

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Page content |
| `sections` | `Section[]` | Page sections configuration |
| `title` | `string` | Page title |
| `subtitle` | `string` | Page subtitle |
| `actions` | `Action[]` | Page action buttons |
| `loading` | `boolean` | Shows loading state |
| `className` | `string` | Additional CSS classes |

**Usage Count:** 12+ imports

#### 5. PageHeader (`@components/global/PageHeader`)

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Header title |
| `subtitle` | `string` | Header subtitle |
| `actions` | `React.ReactNode` | Action buttons |
| `breadcrumbs` | `Breadcrumb[]` | Breadcrumb navigation |
| `className` | `string` | Additional CSS classes |

**Usage Count:** 10+ imports

#### 6. Dropdown (`@components/global/Dropdown`)

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Form field name |
| `value` | `string \| string[]` | Selected value(s) |
| `onChange` | `(e: { target: { name: string; value: string \| string[] } }) => void` | Change handler |
| `options` | `Option[]` | Available options array |
| `placeholder` | `string` | Placeholder text |
| `className` | `string` | Additional CSS classes |
| `disabled` | `boolean` | Disables the dropdown |
| `required` | `boolean` | Makes field required |
| `error` | `string` | Error message |
| `onFocus` | `() => void` | Focus handler |
| `onBlur` | `() => void` | Blur handler |
| `isMultiSelect` | `boolean` | Enables multiple selection |
| `searchable` | `boolean` | Enables search functionality |
| `maxHeight` | `string` | Maximum height of dropdown |
| `groupBy` | `string \| null` | Group options by field |
| `leftIcon` | `string \| null` | Left icon path |

**Usage Count:** 10+ imports

#### 7. Modal (`@components/global/Modal`)

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Close handler |
| `title` | `string` | Modal title |
| `showCloseIcon` | `boolean` | Shows close button |
| `children` | `React.ReactNode` | Modal content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | Modal size |
| `centered` | `boolean` | Centers modal vertically |
| `backdropClosable` | `boolean` | Closes on backdrop click |
| `className` | `string` | Additional CSS classes |
| `modalId` | `string` | Unique modal identifier |
| `showConfirmButton` | `boolean` | Shows confirm button |
| `confirmButtonLabel` | `string` | Confirm button text |
| `onConfirm` | `() => void` | Confirm button handler |

**Usage Count:** 8+ imports

### ⚠️ MODERATELY USED COMPONENTS (3-9 imports)

#### 8. TimeRangeSelector (`@components/global/TimeRangeSelector`)

| Prop | Type | Description |
|------|------|-------------|
| `availableTimeRanges` | `string[]` | Available time range options |
| `selectedTimeRange` | `string` | Currently selected time range |
| `handleTimeRangeChange` | `(range: string) => void` | Time range change handler |
| `timeRangeLabels` | `Record<string, string>` | Custom labels for time ranges |

**Usage Count:** 5+ imports

#### 9. Header (`@components/global/Header`)

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Header title |
| `onSidebarToggle` | `() => void` | Sidebar toggle handler |
| `onSearch` | `(query: string) => void` | Search handler |
| `actions` | `HeaderAction[]` | Header action buttons |
| `secondaryLogo` | `string` | Secondary logo path |

**Usage Count:** 5+ imports

#### 10. FormInput (`@components/forms/FormInput`)

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Form field name |
| `label` | `string` | Field label |
| `type` | `string` | Input type |
| `value` | `any` | Field value |
| `onChange` | `(value: any) => void` | Change handler |
| `placeholder` | `string` | Placeholder text |
| `required` | `boolean` | Makes field required |
| `error` | `string` | Error message |
| `disabled` | `boolean` | Disables the field |
| `options` | `Option[]` | Options for select inputs |
| `className` | `string` | Additional CSS classes |

**Usage Count:** 4+ imports

#### 11. LoadingSpinner (`@components/global/LoadingSpinner`)

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |

**Usage Count:** 4+ imports

#### 12. Form (`@components/forms/Form`)

| Prop | Type | Description |
|------|------|-------------|
| `config` | `FormInputConfig[]` | Form field configurations |
| `onSubmit` | `(values: FormInputValue) => void` | Form submit handler |
| `initialValues` | `FormInputValue` | Initial form values |
| `loading` | `boolean` | Shows loading state |
| `submitText` | `string` | Submit button text |
| `className` | `string` | Additional CSS classes |

**Usage Count:** 3+ imports

#### 13. Holder (`@components/global/Holder`)

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `height` | `string \| number` | Container height |
| `title` | `string` | Holder title |
| `DateRange` | `string` | Date range text |
| `availableTimeRanges` | `string[]` | Available time ranges |
| `selectedTimeRange` | `string` | Selected time range |
| `handleTimeRangeChange` | `(range: string) => void` | Time range change handler |
| `handleDownload` | `() => void` | Download handler |
| `loading` | `boolean` | Shows loading state |
| `children` | `React.ReactNode` | Holder content |

**Usage Count:** 3+ imports

### ❓ LIMITED USAGE COMPONENTS (1-2 imports)

#### 14. Logo (`@components/global/Logo`)

| Prop | Type | Description |
|------|------|-------------|
| `width` | `number` | Logo width |
| `isCollapsed` | `boolean` | Shows collapsed state |
| `customLogo` | `string` | Custom logo path |

**Usage Count:** 1-2 imports

#### 15. Search (`@components/global/Search`)

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Search input value |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | Change handler |
| `placeholder` | `string` | Placeholder text |
| `onResultClick` | `(result: SearchResult) => void` | Result click handler |
| `results` | `SearchResult[]` | Search results |
| `isLoading` | `boolean` | Shows loading state |
| `showShortcut` | `boolean` | Shows keyboard shortcut |
| `className` | `string` | Additional CSS classes |
| `type` | `string` | Input type |
| `disabled` | `boolean` | Disables the input |
| `required` | `boolean` | Makes field required |
| `error` | `string \| null` | Error message |
| `name` | `string` | Input name |

**Usage Count:** 1-2 imports

#### 16. ProtectedRoute (`@components/auth/ProtectedRoute`)

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Protected content |
| `requiredRole` | `string` | Required user role |
| `fallback` | `React.ReactNode` | Fallback component |

**Usage Count:** 1-2 imports

#### 17. MainLayout (`@components/layout/MainLayout`)

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Layout content |
| `sidebarCollapsed` | `boolean` | Sidebar collapse state |
| `onSidebarToggle` | `() => void` | Sidebar toggle handler |

**Usage Count:** 1-2 imports

#### 18. Step1 (`@components/AddConsumer/Step1`)

| Prop | Type | Description |
|------|------|-------------|
| `onNext` | `() => void` | Next step handler |
| `formData` | `any` | Form data object |
| `onFormDataChange` | `(data: any) => void` | Form data change handler |

**Usage Count:** 1-2 imports

#### 19. Step2 (`@components/AddConsumer/Step2`)

| Prop | Type | Description |
|------|------|-------------|
| `onNext` | `() => void` | Next step handler |
| `onPrevious` | `() => void` | Previous step handler |
| `formData` | `any` | Form data object |
| `onFormDataChange` | `(data: any) => void` | Form data change handler |

**Usage Count:** 1-2 imports

#### 20. Step3 (`@components/AddConsumer/Step3`)

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `() => void` | Submit handler |
| `onPrevious` | `() => void` | Previous step handler |
| `formData` | `any` | Form data object |
| `onFormDataChange` | `(data: any) => void` | Form data change handler |

**Usage Count:** 1-2 imports

## 📊 SUMMARY

### ✅ **ACTUALLY USED COMPONENTS: 20**

**Most Used (10+ imports):** 7 components
- Button, Card, Table, Page, PageHeader, Dropdown, Modal

**Moderately Used (3-9 imports):** 6 components
- TimeRangeSelector, Header, FormInput, LoadingSpinner, Form, Holder

**Limited Usage (1-2 imports):** 7 components
- Logo, Search, ProtectedRoute, MainLayout, Step1, Step2, Step3

### ❌ **NOT USED (12 components):**
- RecentActivities, ExpandableTable, Tabs, Sidebar, CardSkeleton, TableSkeleton, Input, TextInput, TextareaInput, SelectInput, CheckboxInput, FileInput

## 🎯 KEY FINDINGS

1. **20 components are actually used** in your codebase
2. **12 components are unused** and can be considered for removal
3. **Most critical components:** Button, Card, Table, Page, PageHeader, Dropdown, Modal
4. **Form components:** Only Form and FormInput are used, renderers are unused
5. **Skeleton components:** Both CardSkeleton and TableSkeleton are unused 