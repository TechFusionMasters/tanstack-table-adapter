import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Table as TanStackTable,
  RowSelectionState,
  ColumnResizeMode,
  PaginationState,
  ExpandedState,
  OnChangeFn,
  FilterFn,
  Row,
  RowData,
  ColumnPinningState,
  ColumnPinningPosition,
} from "@tanstack/react-table";

// Default className configuration
export type DefaultTableClassNames = {
  table: string;
  thead: string;
  theadRow: string;
  theadCell: string;
  tbody: string;
  tbodyRow: string;
  tbodyCell: string;
  header: string;
  body: string;
};

// Component-level className overrides
export type TableClassNames = Partial<DefaultTableClassNames>;

// Global configuration context
export type TableConfig = {
  defaultClassNames: DefaultTableClassNames;
  setDefaultClassNames: (classNames: Partial<DefaultTableClassNames>) => void;
};

// Group feature flags together
export type TableFeatures = {
  pagination?: boolean;
  sorting?: boolean;
  multiSort?: boolean;
  columnFilters?: boolean;
  globalFilter?: boolean;
  columnResizing?: boolean;
  rowSelection?: boolean;
  expanding?: boolean;
  columnOrdering?: boolean;
  pinning?: boolean;
  stickyHeader?: boolean;
  grouping?: boolean;
  formMode?: boolean;
  virtualization?: boolean;
  sortingRemoval?: boolean;
};

// Group styling props together
export type TableStyling = {
  className?: string;
  classNames?: TableClassNames;
  columnResizeMode?: ColumnResizeMode;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties | ((row: Row<any>) => React.CSSProperties);
  cellStyle?:
    | React.CSSProperties
    | ((row: Row<any>, columnId: string) => React.CSSProperties);
};

// Group loading state props
export type TableLoading = {
  isLoading?: boolean;
  isPaginationLoading?: boolean;
  isSortingLoading?: boolean;
  isFilteringLoading?: boolean;
  isExportLoading?: boolean;
  showOverlayLoading?: boolean;
  loadingComponent?: React.ReactNode;
  paginationLoadingComponent?: React.ReactNode;
};

// Group server-side props
export type TableServer = {
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualGrouping?: boolean;
  pageCount?: number;
  autoResetPageIndex?: boolean;
  fetchData?: <TData extends object>(options: {
    pagination: PaginationState;
    sorting: SortingState;
    filters: ColumnFiltersState;
    globalFilter: string;
  }) => Promise<{
    data: TData[];
    pageCount: number;
    totalRowCount?: number;
  }>;
  onFetchError?: (error: Error) => void;
};

// Group accessibility props
export type TableAccessibility = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaRowCount?: boolean;
  ariaColumnCount?: boolean;
  ariaLiveRegion?: boolean;
  keyboardNavigation?: boolean;
};

// Group animation props
export type TableAnimations = {
  enableAnimations?: boolean;
  rowAnimationDuration?: number;
  sortAnimationDuration?: number;
  expandAnimationDuration?: number;
  // Plugin options - consumer can use any animation library
  animationLib?: "css" | "framer-motion" | "react-spring" | string;
  customAnimationProps?: Record<string, any>;
};

// Group virtualization props
export type TableVirtualization = {
  rowHeight?: number;
  visibleRows?: number;
  // Plugin options - consumer can use any virtualization library
  virtualizationLib?:
    | "react-window"
    | "react-virtualized"
    | "tanstack-virtual"
    | string;
  customVirtualizationProps?: Record<string, any>;
};

// Group export options
export type TableExportOptions = {
  formats?: ("csv" | "xlsx" | "json")[];
  fileName?: string;
  includeHiddenColumns?: boolean;
  exportSelection?: boolean;
  customFormatter?: (data: any, columnId: string) => string;
};

// Group form integration props
export type TableFormIntegration<TData> = {
  onRowsChange?: (updatedData: TData[]) => void;
  onSubmit?: (data: TData[]) => void;
  validationRules?: Record<string, (value: any, row: TData) => string | null>;
  showValidationErrors?: boolean;
  renderValidationError?: (error: string) => React.ReactNode;
  // Plugin options - consumer can use any form library
  formLib?: "react-hook-form" | "formik" | string;
  customFormProps?: Record<string, any>;
};

// Group render props
export type TableRender<TData> = {
  renderTableHeader?: (table: TanStackTable<TData>) => React.ReactNode;
  renderTableFooter?: (table: TanStackTable<TData>) => React.ReactNode;
  renderPagination?: (props: {
    table: TanStackTable<TData>;
    totalRowCount?: number;
    isLoading?: boolean;
    pageSizeOptions?: number[];
  }) => React.ReactNode;
  renderNoResults?: (table: TanStackTable<TData>) => React.ReactNode;
  renderExpanded?: (row: Row<TData>) => React.ReactNode;
  renderRowSubComponent?: (row: Row<TData>) => React.ReactNode;
  renderGroupedCell?: (info: {
    row: Row<TData>;
    cell: any;
    groupedByKey: string;
  }) => React.ReactNode;
  renderSortIcon?: (direction: "asc" | "desc" | false) => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
};

// Group state props
export type TableState = {
  pagination?: PaginationState;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  globalFilter?: string;
  columnVisibility?: VisibilityState;
  rowSelection?: RowSelectionState;
  expanded?: ExpandedState;
  columnOrder?: string[];
  columnPinning?: ColumnPinningState;
  grouping?: string[];
};

// Group state change handlers
export type TableStateHandlers<TData> = {
  onPaginationChange?: OnChangeFn<PaginationState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onGlobalFilterChange?: OnChangeFn<string>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  onColumnOrderChange?: OnChangeFn<string[]>;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
  onGroupingChange?: OnChangeFn<string[]>;
  onCellEdit?: (rowIndex: number, columnId: string, value: unknown) => void;
};

// Group event handlers
export type TableEventHandlers<TData> = {
  onRowClick?: (row: Row<TData>) => void;
  onCellClick?: (row: Row<TData>, columnId: string) => void;
  onExportData?: (data: TData[], options?: TableExportOptions) => void;
  onError?: (error: Error) => void;
};

// Main TableAdapter props with grouped structure
export type TableAdapterProps<TData extends object, TValue = unknown> = {
  // Core Props
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  totalRowCount?: number;
  id?: string;
  debugTable?: boolean;
  getRowId?: (row: TData, index: number, parent?: Row<TData>) => string;
  error?: Error | null;

  // Grouped Props
  features?: Partial<TableFeatures>;
  styling?: TableStyling;
  loading?: TableLoading;
  server?: TableServer;
  accessibility?: TableAccessibility;
  animations?: TableAnimations;
  virtualization?: TableVirtualization;
  exportOptions?: TableExportOptions;
  formIntegration?: TableFormIntegration<TData>;

  // Render Props
  render?: TableRender<TData>;

  // State Props
  state?: TableState;
  onStateChange?: TableStateHandlers<TData>;

  // Event Handlers
  events?: TableEventHandlers<TData>;

  // Legacy Props - to maintain backward compatibility
  // These will be mapped to the grouped props internally
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnResizing?: boolean;
  enableRowSelection?: boolean;
  enableExpanding?: boolean;
  enablePinning?: boolean;
  enableStickyHeader?: boolean;
  enableGrouping?: boolean;
  enableSortingRemoval?: boolean;

  className?: string;
  classNames?: TableClassNames;
  columnResizeMode?: ColumnResizeMode;

  pageSize?: number;
  pageIndex?: number;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  globalFilter?: string;
  columnVisibility?: VisibilityState;
  rowSelection?: RowSelectionState;
  expanded?: ExpandedState;
  columnOrder?: string[];
  columnPinning?: ColumnPinningState;
  grouping?: string[];

  onPaginationChange?: OnChangeFn<PaginationState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onGlobalFilterChange?: OnChangeFn<string>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  onColumnOrderChange?: OnChangeFn<string[]>;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
  onGroupingChange?: OnChangeFn<string[]>;

  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualGrouping?: boolean;
  pageCount?: number;
  autoResetPageIndex?: boolean;
  globalFilterFn?: FilterFn<TData>;

  renderTableHeader?: (table: TanStackTable<TData>) => React.ReactNode;
  renderTableFooter?: (table: TanStackTable<TData>) => React.ReactNode;
  renderPagination?: (props: {
    table: TanStackTable<TData>;
    totalRowCount?: number;
    isLoading?: boolean;
    pageSizeOptions?: number[];
  }) => React.ReactNode;
  renderNoResults?: (table: TanStackTable<TData>) => React.ReactNode;
  renderExpanded?: (row: Row<TData>) => React.ReactNode;
  renderRowSubComponent?: (row: Row<TData>) => React.ReactNode;
  renderGroupedCell?: (info: {
    row: Row<TData>;
    cell: any;
    groupedByKey: string;
  }) => React.ReactNode;

  onRowClick?: (row: Row<TData>) => void;
  onCellClick?: (row: Row<TData>, columnId: string) => void;
  onExportData?: (data: TData[]) => void;

  isLoading?: boolean;
  isPaginationLoading?: boolean;
  loadingComponent?: React.ReactNode;
  paginationLoadingComponent?: React.ReactNode;
  showOverlayLoading?: boolean;

  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;

  pageSizeOptions?: number[];

  renderSortIcon?: (direction: "asc" | "desc" | false) => React.ReactNode;
};

// Extend the ColumnMeta interface to include custom properties
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    exportData?: () => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
    cellClassName?: string;
    cellStyle?: React.CSSProperties;
  }
}
