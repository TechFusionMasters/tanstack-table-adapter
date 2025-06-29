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
} from "@tanstack/react-table";

// Group similar props together
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
};

export type TableStyling = {
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((row: any) => string);
  cellClassName?: string | ((row: any, columnId: string) => string);
  columnResizeMode?: ColumnResizeMode;
};

export type TableLoading = {
  isLoading?: boolean;
  isPaginationLoading?: boolean;
  showOverlayLoading?: boolean;
  loadingComponent?: React.ReactNode;
  paginationLoadingComponent?: React.ReactNode;
};

export type TableServer = {
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualGrouping?: boolean;
  pageCount?: number;
  autoResetPageIndex?: boolean;
};

export type TableAccessibility = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
};

export type TableRender<TData> = {
  tableHeader?: (table: TanStackTable<TData>) => React.ReactNode;
  tableFooter?: (table: TanStackTable<TData>) => React.ReactNode;
  pagination?: (props: {
    table: TanStackTable<TData>;
    totalRowCount?: number;
    isLoading?: boolean;
    pageSizeOptions?: number[];
  }) => React.ReactNode;
  noResults?: (table: TanStackTable<TData>) => React.ReactNode;
  expanded?: (row: Row<TData>) => React.ReactNode;
  rowSubComponent?: (row: Row<TData>) => React.ReactNode;
  groupedCell?: (info: {
    row: Row<TData>;
    cell: any;
    groupedByKey: string;
  }) => React.ReactNode;
};

export type TableAdapterProps<TData extends object> = {
  // Core Props
  data: TData[];
  columns: ColumnDef<TData, any>[];
  totalRowCount?: number;
  id?: string;
  debugTable?: boolean;
  getRowId?: (row: TData, index: number, parent?: Row<TData>) => string;

  // Styling Props
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((row: Row<TData>) => string);
  cellClassName?: string | ((row: Row<TData>, columnId: string) => string);
  columnResizeMode?: ColumnResizeMode;

  // Feature Props
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

  // State Props
  pageSize?: number;
  pageIndex?: number;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  globalFilter?: string;
  columnVisibility?: VisibilityState;
  rowSelection?: RowSelectionState;
  expanded?: ExpandedState;
  columnOrder?: string[];
  columnPinning?: { left: string[]; right: string[] };
  grouping?: string[];

  // Controlled State Handlers
  onPaginationChange?: OnChangeFn<PaginationState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onGlobalFilterChange?: OnChangeFn<string>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  onColumnOrderChange?: OnChangeFn<string[]>;
  onColumnPinningChange?: OnChangeFn<{ left: string[]; right: string[] }>;
  onGroupingChange?: OnChangeFn<string[]>;

  // Advanced Props
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualGrouping?: boolean;
  pageCount?: number;
  autoResetPageIndex?: boolean;
  globalFilterFn?: FilterFn<TData>;

  // Custom Components
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

  // Custom Event Handlers
  onRowClick?: (row: Row<TData>) => void;
  onCellClick?: (row: Row<TData>, columnId: string) => void;
  onExportData?: (data: TData[]) => void;

  // Loading State
  isLoading?: boolean;
  isPaginationLoading?: boolean;
  loadingComponent?: React.ReactNode;
  paginationLoadingComponent?: React.ReactNode;
  showOverlayLoading?: boolean;

  // Accessibility
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;

  // Pagination Options
  pageSizeOptions?: number[];

  // Sorting Customization
  renderSortIcon?: (direction: "asc" | "desc" | false) => React.ReactNode;
  enableSortingRemoval?: boolean;
};
