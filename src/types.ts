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

/**
 * Default class names for various table elements
 *
 * This type defines the class names for all table elements that can be styled
 * through the TableAdapter. These class names are used as defaults and can be
 * overridden at the global level through TableConfigProvider or at the component
 * level through the classNames prop.
 *
 * @example
 * ```tsx
 * const myClassNames: DefaultTableClassNames = {
 *   table: "min-w-full divide-y divide-gray-200",
 *   thead: "bg-gray-50",
 *   theadRow: "",
 *   theadCell: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
 *   tbody: "bg-white divide-y divide-gray-200",
 *   tbodyRow: "hover:bg-gray-50",
 *   tbodyCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
 *   header: "bg-gray-50",
 *   body: "bg-white",
 * };
 * ```
 */
export type DefaultTableClassNames = {
  /** Class name applied to the <table> element */
  table: string;
  /** Class name applied to the <thead> element */
  thead: string;
  /** Class name applied to the <tr> elements within the table header */
  theadRow: string;
  /** Class name applied to the <th> elements within the table header */
  theadCell: string;
  /** Class name applied to the <tbody> element */
  tbody: string;
  /** Class name applied to the <tr> elements within the table body */
  tbodyRow: string;
  /** Class name applied to the <td> elements within the table body */
  tbodyCell: string;
  /** Class name applied to the header container (when using custom header rendering) */
  header: string;
  /** Class name applied to the body container (when using custom body rendering) */
  body: string;
};

/**
 * Partial class names for overriding specific table elements
 *
 * This type allows you to override only specific class names while inheriting the rest
 * from the default or globally configured class names.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   classNames={{
 *     table: "border-collapse w-full",
 *     tbodyRow: "hover:bg-blue-50",
 *   }}
 * />
 * ```
 */
export type TableClassNames = Partial<DefaultTableClassNames>;

/**
 * Global configuration context for table styling
 *
 * This type defines the shape of the configuration context provided by
 * the TableConfigProvider. It allows setting global default class names
 * that will be used by all TableAdapter instances within the provider's scope.
 *
 * @example
 * ```tsx
 * const { setDefaultClassNames } = useTableConfig();
 *
 * // Update global table styling
 * setDefaultClassNames({
 *   table: "min-w-full border-collapse",
 *   theadCell: "px-4 py-2 font-bold text-left",
 * });
 * ```
 */
export type TableConfig = {
  /**
   * Current default class names applied to all tables
   * within the provider's scope
   */
  defaultClassNames: DefaultTableClassNames;

  /**
   * Function to update the default class names
   *
   * @param classNames - Partial class names to merge with existing defaults
   */
  setDefaultClassNames: (classNames: Partial<DefaultTableClassNames>) => void;
};

/**
 * Feature flags for enabling/disabling table functionality
 *
 * This type allows granular control over which features are enabled in the
 * TableAdapter. Each property is an optional boolean that, when true, enables
 * the corresponding feature.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   features={{
 *     pagination: true,
 *     sorting: true,
 *     columnFilters: false,
 *     rowSelection: true,
 *   }}
 * />
 * ```
 */
export type TableFeatures = {
  /**
   * Enable pagination controls
   * @default true
   */
  pagination?: boolean;

  /**
   * Enable column sorting
   * @default true
   */
  sorting?: boolean;

  /**
   * Enable multi-column sorting (requires sorting to be enabled)
   * @default true
   */
  multiSort?: boolean;

  /**
   * Enable per-column filtering
   * @default false
   */
  columnFilters?: boolean;

  /**
   * Enable global table filtering
   * @default false
   */
  globalFilter?: boolean;

  /**
   * Enable column resizing
   * @default false
   */
  columnResizing?: boolean;

  /**
   * Enable row selection
   * @default false
   */
  rowSelection?: boolean;

  /**
   * Enable row expansion
   * @default false
   */
  expanding?: boolean;

  /**
   * Enable column ordering/reordering
   * @default false
   */
  columnOrdering?: boolean;

  /**
   * Enable column pinning (left/right)
   * @default false
   */
  pinning?: boolean;

  /**
   * Enable sticky header
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Enable row grouping
   * @default false
   */
  grouping?: boolean;

  /**
   * Enable form editing mode
   * @default false
   */
  formMode?: boolean;

  /**
   * Enable virtualization for large datasets
   * @default false
   */
  virtualization?: boolean;

  /**
   * Enable removal of sorting when clicking a sorted column
   * @default true
   */
  sortingRemoval?: boolean;
};

/**
 * Styling options for the table
 *
 * This type defines various styling options for the TableAdapter,
 * including class names, inline styles, and column resize mode.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   styling={{
 *     className: "my-table-container",
 *     classNames: { table: "border-2 border-gray-200" },
 *     style: { maxHeight: "500px" },
 *     rowStyle: (row) => ({
 *       backgroundColor: row.original.status === "active" ? "#f0f9ff" : "white"
 *     }),
 *   }}
 * />
 * ```
 */
export type TableStyling = {
  /**
   * Class name for the outer container div
   * @default "w-full"
   */
  className?: string;

  /**
   * Class names for specific table elements
   * These override the global defaults
   */
  classNames?: TableClassNames;

  /**
   * Column resize mode
   * @default "onChange"
   */
  columnResizeMode?: ColumnResizeMode;

  /** Inline styles for the outer container div */
  style?: React.CSSProperties;

  /** Inline styles for the table header */
  headerStyle?: React.CSSProperties;

  /**
   * Inline styles for table rows
   * Can be a fixed style object or a function that returns a style
   * object based on the row
   */
  rowStyle?: React.CSSProperties | ((row: Row<any>) => React.CSSProperties);

  /**
   * Inline styles for table cells
   * Can be a fixed style object or a function that returns a style
   * object based on the row and column ID
   */
  cellStyle?:
    | React.CSSProperties
    | ((row: Row<any>, columnId: string) => React.CSSProperties);
};

/**
 * Loading state configuration
 *
 * This type defines options for controlling loading indicators and states
 * in the TableAdapter. It allows customizing loading behavior for different
 * operations like initial loading, pagination, sorting, and filtering.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   loading={{
 *     isLoading: isLoadingData,
 *     isPaginationLoading: isChangingPage,
 *     showOverlayLoading: true,
 *     loadingComponent: <MyCustomSpinner />,
 *   }}
 * />
 * ```
 */
export type TableLoading = {
  /**
   * Whether the table is in a loading state
   * Shows a loading indicator in place of table content
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether the pagination is in a loading state
   * Shows a loading indicator in the pagination area
   * @default false
   */
  isPaginationLoading?: boolean;

  /**
   * Whether the sorting is in a loading state
   * @default false
   */
  isSortingLoading?: boolean;

  /**
   * Whether the filtering is in a loading state
   * @default false
   */
  isFilteringLoading?: boolean;

  /**
   * Whether the export is in a loading state
   * @default false
   */
  isExportLoading?: boolean;

  /**
   * Whether to show loading as an overlay on top of existing data
   * @default false
   */
  showOverlayLoading?: boolean;

  /**
   * Custom loading component
   * @default DefaultLoadingComponent
   */
  loadingComponent?: React.ReactNode;

  /**
   * Custom pagination loading component
   * @default DefaultPaginationLoadingComponent
   */
  paginationLoadingComponent?: React.ReactNode;
};

/**
 * Server-side functionality configuration
 *
 * This type defines options for server-side data operations like pagination,
 * sorting, and filtering. It allows the TableAdapter to integrate with
 * backend APIs for handling large datasets efficiently.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={currentPageData}
 *   columns={columns}
 *   server={{
 *     manualPagination: true,
 *     manualSorting: true,
 *     pageCount: totalPages,
 *     fetchData: async ({ pagination, sorting }) => {
 *       const result = await fetchFromApi(pagination.pageIndex, pagination.pageSize, sorting);
 *       return {
 *         data: result.data,
 *         pageCount: result.totalPages,
 *         totalRowCount: result.totalItems,
 *       };
 *     },
 *   }}
 * />
 * ```
 */
export type TableServer = {
  /**
   * Whether pagination is handled manually (server-side)
   * @default false
   */
  manualPagination?: boolean;

  /**
   * Whether sorting is handled manually (server-side)
   * @default false
   */
  manualSorting?: boolean;

  /**
   * Whether filtering is handled manually (server-side)
   * @default false
   */
  manualFiltering?: boolean;

  /**
   * Whether grouping is handled manually (server-side)
   * @default false
   */
  manualGrouping?: boolean;

  /**
   * Total number of pages available (for server-side pagination)
   * @default -1
   */
  pageCount?: number;

  /**
   * Whether to reset page index when filters/sorting changes
   * @default !manualPagination
   */
  autoResetPageIndex?: boolean;

  /**
   * Function to fetch data from the server
   *
   * This function is called whenever paginated, sorted, or filtered data
   * needs to be loaded. It receives the current table state and should
   * return a promise that resolves to an object containing the data,
   * page count, and optional total row count.
   *
   * @param options - Current table state options
   * @returns Promise with fetched data and metadata
   */
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

  /**
   * Error handler for fetch operations
   * Called when the fetchData function throws an error
   */
  onFetchError?: (error: Error) => void;
};

/**
 * Accessibility configuration
 *
 * This type defines options for enhancing the accessibility of the table,
 * including ARIA attributes and keyboard navigation.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   accessibility={{
 *     ariaLabel: "User data table",
 *     ariaLiveRegion: true,
 *     keyboardNavigation: true,
 *   }}
 * />
 * ```
 */
export type TableAccessibility = {
  /**
   * ARIA label for the table
   * Equivalent to setting aria-label on the table element
   */
  ariaLabel?: string;

  /**
   * ID of an element that labels the table
   * Equivalent to setting aria-labelledby on the table element
   */
  ariaLabelledBy?: string;

  /**
   * ID of an element that describes the table
   * Equivalent to setting aria-describedby on the table element
   */
  ariaDescribedBy?: string;

  /**
   * Whether to add the aria-rowcount attribute to the table
   * @default false
   */
  ariaRowCount?: boolean;

  /**
   * Whether to add the aria-colcount attribute to the table
   * @default false
   */
  ariaColumnCount?: boolean;

  /**
   * Whether to include an ARIA live region for table announcements
   * @default false
   */
  ariaLiveRegion?: boolean;

  /**
   * Whether to enable keyboard navigation (Home/End/PageUp/PageDown)
   * @default false
   */
  keyboardNavigation?: boolean;
};

/**
 * Animation configuration
 *
 * This type defines options for animating various table interactions
 * like row changes, sorting, and expansion.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   animations={{
 *     enableAnimations: true,
 *     rowAnimationDuration: 150,
 *     animationLib: "framer-motion",
 *     customAnimationProps: {
 *       initial: { opacity: 0 },
 *       animate: { opacity: 1 },
 *     },
 *   }}
 * />
 * ```
 */
export type TableAnimations = {
  /**
   * Whether to enable animations
   * @default false
   */
  enableAnimations?: boolean;

  /**
   * Duration (in ms) for row animations
   * @default 300
   */
  rowAnimationDuration?: number;

  /**
   * Duration (in ms) for sort animations
   * @default 200
   */
  sortAnimationDuration?: number;

  /**
   * Duration (in ms) for expand/collapse animations
   * @default 300
   */
  expandAnimationDuration?: number;

  /**
   * Animation library to use
   * The TableAdapter is designed to work with various animation libraries
   * through a plugin system. The specific library can be specified here.
   * @default "css"
   */
  animationLib?: "css" | "framer-motion" | "react-spring" | string;

  /**
   * Custom animation props to pass to the animation library
   * The exact format depends on the animation library being used
   */
  customAnimationProps?: Record<string, any>;
};

/**
 * Virtualization configuration for large datasets
 *
 * This type defines options for virtualizing the table rendering,
 * which is useful for handling large datasets efficiently.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={largeDataset}
 *   columns={columns}
 *   features={{ virtualization: true }}
 *   virtualization={{
 *     rowHeight: 40,
 *     visibleRows: 15,
 *     virtualizationLib: "react-window",
 *   }}
 * />
 * ```
 */
export type TableVirtualization = {
  /**
   * Height (in pixels) of each row
   * Used for calculating the virtual list size
   * @default 35
   */
  rowHeight?: number;

  /**
   * Number of rows to render at once
   * @default 10
   */
  visibleRows?: number;

  /**
   * Virtualization library to use
   * The TableAdapter is designed to work with various virtualization
   * libraries through a plugin system. The specific library can be
   * specified here.
   * @default "none"
   */
  virtualizationLib?:
    | "react-window"
    | "react-virtualized"
    | "tanstack-virtual"
    | string;

  /**
   * Custom virtualization props to pass to the virtualization library
   * The exact format depends on the virtualization library being used
   */
  customVirtualizationProps?: Record<string, any>;
};

/**
 * Export options configuration
 *
 * This type defines options for exporting table data to various formats
 * like CSV, Excel, and JSON.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   exportOptions={{
 *     formats: ["csv", "json"],
 *     fileName: "user-data-export",
 *     includeHiddenColumns: false,
 *     customFormatter: (value, columnId) =>
 *       columnId === "date" ? new Date(value).toLocaleDateString() : value,
 *   }}
 * />
 * ```
 */
export type TableExportOptions = {
  /**
   * Available export formats
   * @default ["csv"]
   */
  formats?: ("csv" | "xlsx" | "json")[];

  /**
   * Base file name for exports (without extension)
   * @default "export"
   */
  fileName?: string;

  /**
   * Whether to include hidden columns in exports
   * @default false
   */
  includeHiddenColumns?: boolean;

  /**
   * Whether to export only selected rows
   * @default false
   */
  exportSelection?: boolean;

  /**
   * Custom formatter function for cell values during export
   *
   * @param data - The cell value
   * @param columnId - The column ID
   * @returns The formatted value for export
   */
  customFormatter?: (data: any, columnId: string) => string;
};

/**
 * Form integration configuration
 *
 * This type defines options for using the table as an editable form,
 * with validation and submission handling.
 *
 * @template TData - The type of data being displayed in the table
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={users}
 *   columns={columns}
 *   features={{ formMode: true }}
 *   formIntegration={{
 *     onSubmit: (updatedData) => saveUsers(updatedData),
 *     validationRules: {
 *       email: (value) => !value.includes('@') ? 'Invalid email' : null,
 *       age: (value) => value < 18 ? 'Must be 18+' : null,
 *     },
 *     showValidationErrors: true,
 *   }}
 * />
 * ```
 */
export type TableFormIntegration<TData> = {
  /**
   * Handler for row data changes
   * Called whenever any cell value is changed
   */
  onRowsChange?: (updatedData: TData[]) => void;

  /**
   * Handler for form submission
   * Called when the form is submitted (e.g., by clicking Save)
   */
  onSubmit?: (data: TData[]) => void;

  /**
   * Validation rules for form fields
   *
   * A map of column IDs to validation functions. Each function takes the
   * cell value and the row object, and returns an error message (string)
   * if validation fails, or null if validation passes.
   */
  validationRules?: Record<string, (value: any, row: TData) => string | null>;

  /**
   * Whether to show validation errors in the UI
   * @default true
   */
  showValidationErrors?: boolean;

  /**
   * Custom renderer for validation error messages
   */
  renderValidationError?: (error: string) => React.ReactNode;

  /**
   * Form library to integrate with
   * The TableAdapter is designed to work with various form libraries
   * through a plugin system. The specific library can be specified here.
   */
  formLib?: "react-hook-form" | "formik" | string;

  /**
   * Custom form props to pass to the form library
   * The exact format depends on the form library being used
   */
  customFormProps?: Record<string, any>;
};

/**
 * Custom rendering options
 *
 * This type defines custom rendering functions for various parts of the table,
 * allowing for complete customization of the table's appearance.
 *
 * @template TData - The type of data being displayed in the table
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   render={{
 *     renderTableHeader: (table) => (
 *       <div className="flex justify-between items-center mb-4">
 *         <h2>Users</h2>
 *         <button>Add User</button>
 *       </div>
 *     ),
 *     renderNoResults: () => <div>No users found</div>,
 *     renderSortIcon: (dir) => dir === "asc" ? "↑" : dir === "desc" ? "↓" : "↕",
 *   }}
 * />
 * ```
 */
export type TableRender<TData> = {
  /**
   * Custom renderer for the table header area
   * This appears above the table element
   */
  renderTableHeader?: (table: TanStackTable<TData>) => React.ReactNode;

  /**
   * Custom renderer for the table footer area
   * This appears below the table element
   */
  renderTableFooter?: (table: TanStackTable<TData>) => React.ReactNode;

  /**
   * Custom renderer for pagination controls
   */
  renderPagination?: (props: {
    table: TanStackTable<TData>;
    totalRowCount?: number;
    isLoading?: boolean;
    pageSizeOptions?: number[];
  }) => React.ReactNode;

  /**
   * Custom renderer for the "no results" state
   * Displayed when the table has no data to show
   */
  renderNoResults?: (table: TanStackTable<TData>) => React.ReactNode;

  /**
   * Custom renderer for expanded row content
   * Used with the `expanding` feature
   */
  renderExpanded?: (row: Row<TData>) => React.ReactNode;

  /**
   * Custom renderer for row sub-components
   * Used with the `expanding` feature
   */
  renderRowSubComponent?: (row: Row<TData>) => React.ReactNode;

  /**
   * Custom renderer for grouped cells
   * Used with the `grouping` feature
   */
  renderGroupedCell?: (info: {
    row: Row<TData>;
    cell: any;
    groupedByKey: string;
  }) => React.ReactNode;

  /**
   * Custom renderer for sort icons
   *
   * @param direction - The sort direction (asc, desc, or false for unsorted)
   * @returns React node to render as the sort icon
   */
  renderSortIcon?: (direction: "asc" | "desc" | false) => React.ReactNode;

  /**
   * Custom renderer for error states
   * Displayed when an error occurs (e.g., in data fetching)
   */
  renderError?: (error: Error) => React.ReactNode;
};

/**
 * Table state configuration
 *
 * This type defines the initial state for various table features
 * like pagination, sorting, filtering, etc.
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   state={{
 *     pagination: { pageIndex: 0, pageSize: 25 },
 *     sorting: [{ id: 'name', desc: false }],
 *     columnVisibility: { hiddenColumn: false },
 *   }}
 * />
 * ```
 */
export type TableState = {
  /** Initial pagination state */
  pagination?: PaginationState;

  /** Initial sorting state */
  sorting?: SortingState;

  /** Initial column filters state */
  columnFilters?: ColumnFiltersState;

  /** Initial global filter value */
  globalFilter?: string;

  /** Initial column visibility state */
  columnVisibility?: VisibilityState;

  /** Initial row selection state */
  rowSelection?: RowSelectionState;

  /** Initial expanded rows state */
  expanded?: ExpandedState;

  /** Initial column order */
  columnOrder?: string[];

  /** Initial column pinning state */
  columnPinning?: ColumnPinningState;

  /** Initial grouping state */
  grouping?: string[];
};

/**
 * State change handlers
 *
 * This type defines handlers for state changes in the table,
 * allowing for controlled components that manage their own state.
 *
 * @template TData - The type of data being displayed in the table
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   state={{ sorting }}
 *   onStateChange={{
 *     onSortingChange: setSorting,
 *     onPaginationChange: setPagination,
 *   }}
 * />
 * ```
 */
export type TableStateHandlers<TData> = {
  /** Handler for pagination state changes */
  onPaginationChange?: OnChangeFn<PaginationState>;

  /** Handler for sorting state changes */
  onSortingChange?: OnChangeFn<SortingState>;

  /** Handler for column filters state changes */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;

  /** Handler for global filter value changes */
  onGlobalFilterChange?: OnChangeFn<string>;

  /** Handler for column visibility state changes */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  /** Handler for row selection state changes */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;

  /** Handler for expanded rows state changes */
  onExpandedChange?: OnChangeFn<ExpandedState>;

  /** Handler for column order changes */
  onColumnOrderChange?: OnChangeFn<string[]>;

  /** Handler for column pinning state changes */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;

  /** Handler for grouping state changes */
  onGroupingChange?: OnChangeFn<string[]>;

  /**
   * Handler for cell edits
   *
   * @param rowIndex - The index of the row being edited
   * @param columnId - The ID of the column being edited
   * @param value - The new value for the cell
   */
  onCellEdit?: (rowIndex: number, columnId: string, value: unknown) => void;
};

/**
 * Event handlers
 *
 * This type defines handlers for various user interactions with the table,
 * such as clicking on rows or cells.
 *
 * @template TData - The type of data being displayed in the table
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={data}
 *   columns={columns}
 *   events={{
 *     onRowClick: (row) => showDetails(row.original),
 *     onExportData: (data) => trackExport(data),
 *   }}
 * />
 * ```
 */
export type TableEventHandlers<TData> = {
  /**
   * Handler for row clicks
   *
   * @param row - The row that was clicked
   */
  onRowClick?: (row: Row<TData>) => void;

  /**
   * Handler for cell clicks
   *
   * @param row - The row containing the cell that was clicked
   * @param columnId - The ID of the column that was clicked
   */
  onCellClick?: (row: Row<TData>, columnId: string) => void;

  /**
   * Handler for data exports
   *
   * @param data - The data being exported
   * @param options - Export options
   */
  onExportData?: (data: TData[], options?: TableExportOptions) => void;

  /**
   * Handler for errors
   *
   * @param error - The error that occurred
   */
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
