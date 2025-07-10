export interface ComponentType {
  id: string;
  type: 'row' | 'column' | 'text' | 'card' | 'table';
  children?: ComponentType[];
  props?: {
    text?: string;
    title?: string;
    value?: string | number;
    icon?: string;
    showTrend?: boolean;
    comparisonValue?: number;
    subtitle1?: string;
    subtitle2?: string;
    // Table props
    data?: any[];
    columns?: {
      key: string;
      label: string;
      render?: (value: any, row: any) => React.ReactNode;
    }[];
    actions?: {
      label: string;
      onClick: (row: any) => void;
      icon: string;
    }[];
    sortable?: boolean;
    searchable?: boolean;
    pagination?: boolean;
    rowsPerPageOptions?: number[];
    initialRowsPerPage?: number;
    onRowClick?: (row: any) => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onView?: (row: any) => void;
    onPayment?: (row: any) => void;
    loading?: boolean;
    emptyMessage?: string;
    serverPagination?: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    onPageChange?: (page: number, limit: number) => void;
    showSkeletonActionButtons?: boolean;
    onSearch?: (value: string) => void;
    tableText?: string;
    showActions?: boolean;
  };
}

export interface DraggableComponentProps {
  id: string;
  type: string;
  children?: React.ReactNode;
  index: number;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
}

export interface CanvasProps {
  components: ComponentType[];
  onDrop: (item: ComponentType, index: number) => void;
  onRowClick?: (component: ComponentType) => void;
  onTextChange?: (id: string, text: string) => void;
} 