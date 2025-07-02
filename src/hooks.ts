import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  ExpandedState,
  Table,
  OnChangeFn,
  ColumnPinningState,
} from "@tanstack/react-table";
import { createControlledHandler, exportToCSV } from "./utils";
import { TableAdapterProps, TableExportOptions, TableServer } from "./types";

// For the custom hooks
/**
 * Custom hook for managing table state with controlled/uncontrolled pattern
 *
 * Handles all table state (sorting, pagination, filtering, etc.) and
 * properly manages the controlled vs. uncontrolled state.
 *
 * @template TData - The type of data being displayed in the table
 * @template TValue - The type of values in the table cells
 *
 * @param props - The TableAdapter props
 * @returns Object containing current state values and handler functions
 */
export function useTableState<TData extends object, TValue = unknown>(
  props: TableAdapterProps<TData, TValue>
) {
  // Initialize states with defaults or provided values
  const initialPageSize =
    props.state?.pagination?.pageSize ?? props.pageSize ?? 10;
  const initialPageIndex =
    props.state?.pagination?.pageIndex ?? props.pageIndex ?? 0;
  const initialSorting = props.state?.sorting ?? props.sorting ?? [];
  const initialColumnFilters =
    props.state?.columnFilters ?? props.columnFilters ?? [];
  const initialGlobalFilter =
    props.state?.globalFilter ?? props.globalFilter ?? "";
  const initialColumnVisibility =
    props.state?.columnVisibility ?? props.columnVisibility ?? {};
  const initialRowSelection =
    props.state?.rowSelection ?? props.rowSelection ?? {};
  const initialExpanded = props.state?.expanded ?? props.expanded ?? {};
  const initialColumnOrder =
    props.state?.columnOrder ?? props.columnOrder ?? [];
  const initialColumnPinning = props.state?.columnPinning ??
    props.columnPinning ?? { left: [], right: [] };
  const initialGrouping = props.state?.grouping ?? props.grouping ?? [];

  // Internal state for uncontrolled mode
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });
  const [sortingState, setSortingState] =
    useState<SortingState>(initialSorting);
  const [columnFiltersState, setColumnFiltersState] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [globalFilterState, setGlobalFilterState] =
    useState<string>(initialGlobalFilter);
  const [columnVisibilityState, setColumnVisibilityState] =
    useState<VisibilityState>(initialColumnVisibility);
  const [rowSelectionState, setRowSelectionState] =
    useState<RowSelectionState>(initialRowSelection);
  const [expandedState, setExpandedState] =
    useState<ExpandedState>(initialExpanded);
  const [columnOrderState, setColumnOrderState] =
    useState<string[]>(initialColumnOrder);
  const [columnPinningState, setColumnPinningState] =
    useState<ColumnPinningState>(initialColumnPinning || {});
  const [groupingState, setGroupingState] = useState<string[]>(initialGrouping);

  // Extract handlers from props (grouped or legacy)
  const onPaginationChange =
    props.onStateChange?.onPaginationChange ?? props.onPaginationChange;
  const onSortingChange =
    props.onStateChange?.onSortingChange ?? props.onSortingChange;
  const onColumnFiltersChange =
    props.onStateChange?.onColumnFiltersChange ?? props.onColumnFiltersChange;
  const onGlobalFilterChange =
    props.onStateChange?.onGlobalFilterChange ?? props.onGlobalFilterChange;
  const onColumnVisibilityChange =
    props.onStateChange?.onColumnVisibilityChange ??
    props.onColumnVisibilityChange;
  const onRowSelectionChange =
    props.onStateChange?.onRowSelectionChange ?? props.onRowSelectionChange;
  const onExpandedChange =
    props.onStateChange?.onExpandedChange ?? props.onExpandedChange;
  const onColumnOrderChange =
    props.onStateChange?.onColumnOrderChange ?? props.onColumnOrderChange;
  const onColumnPinningChange =
    props.onStateChange?.onColumnPinningChange ?? props.onColumnPinningChange;
  const onGroupingChange =
    props.onStateChange?.onGroupingChange ?? props.onGroupingChange;

  // Determine if component is controlled or uncontrolled
  const isControlled = {
    pagination: !!onPaginationChange,
    sorting: !!onSortingChange,
    columnFilters: !!onColumnFiltersChange,
    globalFilter: !!onGlobalFilterChange,
    columnVisibility: !!onColumnVisibilityChange,
    rowSelection: !!onRowSelectionChange,
    expanded: !!onExpandedChange,
    columnOrder: !!onColumnOrderChange,
    columnPinning: !!onColumnPinningChange,
    grouping: !!onGroupingChange,
  };

  // Get current values (from props if controlled, or internal state if uncontrolled)
  const currentPagination = isControlled.pagination
    ? { pageIndex: initialPageIndex, pageSize: initialPageSize }
    : paginationState;
  const currentSorting = isControlled.sorting ? initialSorting : sortingState;
  const currentColumnFilters = isControlled.columnFilters
    ? initialColumnFilters
    : columnFiltersState;
  const currentGlobalFilter = isControlled.globalFilter
    ? initialGlobalFilter
    : globalFilterState;
  const currentColumnVisibility = isControlled.columnVisibility
    ? initialColumnVisibility
    : columnVisibilityState;
  const currentRowSelection = isControlled.rowSelection
    ? initialRowSelection
    : rowSelectionState;
  const currentExpanded = isControlled.expanded
    ? initialExpanded
    : expandedState;
  const currentColumnOrder = isControlled.columnOrder
    ? initialColumnOrder
    : columnOrderState;
  const currentColumnPinning = isControlled.columnPinning
    ? initialColumnPinning
    : columnPinningState;
  const currentGrouping = isControlled.grouping
    ? initialGrouping
    : groupingState;

  // Create controlled handlers using factory function
  const handlePaginationChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.pagination,
        onPaginationChange,
        setPaginationState,
        () => currentPagination
      ),
    [isControlled.pagination, onPaginationChange, currentPagination]
  );

  const handleSortingChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.sorting,
        onSortingChange,
        setSortingState,
        () => currentSorting
      ),
    [isControlled.sorting, onSortingChange, currentSorting]
  );

  const handleColumnFiltersChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.columnFilters,
        onColumnFiltersChange,
        setColumnFiltersState,
        () => currentColumnFilters
      ),
    [isControlled.columnFilters, onColumnFiltersChange, currentColumnFilters]
  );

  const handleGlobalFilterChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.globalFilter,
        onGlobalFilterChange,
        setGlobalFilterState,
        () => currentGlobalFilter
      ),
    [isControlled.globalFilter, onGlobalFilterChange, currentGlobalFilter]
  );

  const handleColumnVisibilityChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.columnVisibility,
        onColumnVisibilityChange,
        setColumnVisibilityState,
        () => currentColumnVisibility
      ),
    [
      isControlled.columnVisibility,
      onColumnVisibilityChange,
      currentColumnVisibility,
    ]
  );

  const handleRowSelectionChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.rowSelection,
        onRowSelectionChange,
        setRowSelectionState,
        () => currentRowSelection
      ),
    [isControlled.rowSelection, onRowSelectionChange, currentRowSelection]
  );

  const handleExpandedChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.expanded,
        onExpandedChange,
        setExpandedState,
        () => currentExpanded
      ),
    [isControlled.expanded, onExpandedChange, currentExpanded]
  );

  const handleColumnOrderChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.columnOrder,
        onColumnOrderChange,
        setColumnOrderState,
        () => currentColumnOrder
      ),
    [isControlled.columnOrder, onColumnOrderChange, currentColumnOrder]
  );

  const handleColumnPinningChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.columnPinning,
        onColumnPinningChange,
        setColumnPinningState,
        () => currentColumnPinning
      ),
    [isControlled.columnPinning, onColumnPinningChange, currentColumnPinning]
  );

  const handleGroupingChange = useMemo(
    () =>
      createControlledHandler(
        isControlled.grouping,
        onGroupingChange,
        setGroupingState,
        () => currentGrouping
      ),
    [isControlled.grouping, onGroupingChange, currentGrouping]
  );

  return {
    // Current state values
    currentPagination,
    currentSorting,
    currentColumnFilters,
    currentGlobalFilter,
    currentColumnVisibility,
    currentRowSelection,
    currentExpanded,
    currentColumnOrder,
    currentColumnPinning,
    currentGrouping,

    // State handlers
    handlePaginationChange,
    handleSortingChange,
    handleColumnFiltersChange,
    handleGlobalFilterChange,
    handleColumnVisibilityChange,
    handleRowSelectionChange,
    handleExpandedChange,
    handleColumnOrderChange,
    handleColumnPinningChange,
    handleGroupingChange,
  };
}

/**
 * Custom hook for server-side data fetching
 *
 * Manages loading states, error handling, and data fetching based on
 * table state changes (pagination, sorting, filtering).
 *
 * @template TData - The type of data being displayed in the table
 *
 * @param table - The TanStack Table instance
 * @param serverOptions - Server-side options for data fetching
 * @param onError - Optional error handler
 * @returns Object containing loading state, data, and error information
 */
export function useServerSideData<TData extends object>(
  table: Table<TData>,
  serverOptions?: TableServer,
  onError?: (error: Error) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (force = false) => {
      // Skip if no fetch function provided
      if (!serverOptions?.fetchData) {
        return;
      }

      // Extract current state from table
      const { pagination, sorting, columnFilters, globalFilter } =
        table.getState();

      // If any of these are being manually handled, fetch data
      if (
        serverOptions.manualPagination ||
        serverOptions.manualSorting ||
        serverOptions.manualFiltering ||
        force
      ) {
        try {
          setIsLoading(true);
          setError(null);

          // Call fetch function with current state
          const result = await serverOptions.fetchData({
            pagination,
            sorting,
            filters: columnFilters,
            globalFilter,
          });

          // Update state with fetched data
          setData(result.data as TData[]);
          setPageCount(result.pageCount);
          if (result.totalRowCount !== undefined) {
            setTotalRowCount(result.totalRowCount);
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          if (onError) {
            onError(error);
          }
          if (serverOptions.onFetchError) {
            serverOptions.onFetchError(error);
          }
        } finally {
          setIsLoading(false);
        }
      }
    },
    [table, serverOptions, onError]
  );

  // Effect to fetch data when relevant state changes
  useEffect(() => {
    fetchData();
  }, [
    fetchData,
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
    table.getState().sorting,
    table.getState().columnFilters,
    table.getState().globalFilter,
  ]);

  return {
    isLoading,
    data,
    pageCount,
    totalRowCount,
    error,
    fetchData,
  };
}

/**
 * Custom hook for CSV/Excel/JSON export functionality
 *
 * Provides methods to export table data in various formats.
 *
 * @template TData - The type of data being displayed in the table
 * @template TValue - The type of values in the table cells
 *
 * @param data - The data to export
 * @param columns - The table columns
 * @param options - Export options (format, filename, etc.)
 * @returns Object containing export functions
 */
export function useTableExport<TData extends object, TValue = unknown>(
  data: TData[],
  columns: ColumnDef<TData, TValue>[],
  options?: TableExportOptions
) {
  // Export to CSV
  const exportToCSVFile = useCallback(
    (customOptions?: Partial<TableExportOptions>) => {
      const mergedOptions = { ...options, ...customOptions };
      exportToCSV(data, columns, {
        filename: mergedOptions?.fileName || "export.csv",
        includeHiddenColumns: mergedOptions?.includeHiddenColumns,
        exportSelection: mergedOptions?.exportSelection,
        customFormatter: mergedOptions?.customFormatter,
      });
    },
    [data, columns, options]
  );

  // Export to JSON
  const exportToJSON = useCallback(
    (customOptions?: Partial<TableExportOptions>) => {
      const mergedOptions = { ...options, ...customOptions };
      const filename = mergedOptions?.fileName || "export.json";

      // Convert data to JSON
      const jsonString = JSON.stringify(data, null, 2);

      // Create download link
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [data, options]
  );

  // Export handler that chooses format based on options
  const handleExport = useCallback(
    (format?: string, customOptions?: Partial<TableExportOptions>) => {
      const exportFormat = format || options?.formats?.[0] || "csv";

      switch (exportFormat.toLowerCase()) {
        case "json":
          exportToJSON(customOptions);
          break;
        case "xlsx":
          // XLSX export would require a library like exceljs or xlsx
          console.warn(
            "XLSX export requires additional libraries. Please implement this based on your needs."
          );
          break;
        case "csv":
        default:
          exportToCSVFile(customOptions);
          break;
      }
    },
    [exportToCSVFile, exportToJSON, options]
  );

  return {
    exportToCSV: exportToCSVFile,
    exportToJSON,
    handleExport,
  };
}

/**
 * Custom hook for form integration with tables
 *
 * Enables editing table data with validation and form submission.
 *
 * @template TData - The type of data being displayed in the table
 *
 * @param initialData - The initial form data
 * @param onSubmit - Form submission handler
 * @param validationRules - Validation rules for form fields
 * @returns Object containing form state and handlers
 */
export function useTableForm<TData extends object>(
  initialData: TData[],
  onSubmit?: (data: TData[]) => void,
  validationRules?: Record<string, (value: any, row: TData) => string | null>
) {
  const [formData, setFormData] = useState<TData[]>(initialData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [isDirty, setIsDirty] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
    setIsDirty(false);
  }, [initialData]);

  // Handle cell value change
  const handleCellChange = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      setFormData((prevData) => {
        const newData = [...prevData];

        // Helper to update nested properties
        const updateNestedProperty = (obj: any, path: string, value: any) => {
          const parts = path.split(".");
          const lastProp = parts.pop()!;
          let current = obj;

          // Navigate to the right object
          for (const part of parts) {
            if (!(part in current)) {
              current[part] = {};
            }
            current = current[part];
          }

          // Update the value
          current[lastProp] = value;
        };

        updateNestedProperty(newData[rowIndex], columnId, value);
        return newData;
      });

      setIsDirty(true);

      // Validate if rules exist
      if (validationRules && validationRules[columnId]) {
        const rule = validationRules[columnId];
        const error = rule(value, formData[rowIndex]);

        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          const rowErrors = { ...(newErrors[rowIndex] || {}) };

          if (error) {
            rowErrors[columnId] = error;
          } else {
            delete rowErrors[columnId];
          }

          if (Object.keys(rowErrors).length > 0) {
            newErrors[rowIndex] = rowErrors;
          } else {
            delete newErrors[rowIndex];
          }

          return newErrors;
        });
      }
    },
    [formData, validationRules]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Check for validation errors
      if (Object.keys(validationErrors).length > 0) {
        return false;
      }

      if (onSubmit) {
        onSubmit(formData);
      }

      setIsDirty(false);
      return true;
    },
    [formData, validationErrors, onSubmit]
  );

  // Reset form to initial data
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setValidationErrors({});
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    validationErrors,
    isDirty,
    handleCellChange,
    handleSubmit,
    resetForm,
  };
}
