import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanStackTable,
  RowSelectionState,
  ColumnResizeMode,
  PaginationState,
  ExpandedState,
  OnChangeFn,
  FilterFn,
  RowData,
  Row,
} from "@tanstack/react-table";

// Import types
import { TableAdapterProps } from "./types";

// Import default components
import {
  DefaultLoadingComponent,
  DefaultPaginationLoadingComponent,
  DefaultNoResultsComponent,
  DefaultPaginationComponent,
} from "./components";

// Use declaration merging to extend the RowData interface
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export function TableAdapter<TData extends object>(
  props: TableAdapterProps<TData>
) {
  // Core Props
  const data = props.data;
  const columns = props.columns;
  const totalRowCount = props.totalRowCount;

  // Misc Props
  const id = props.id;
  const debugTable = props.debugTable;
  const getRowId = props.getRowId;

  // Styling Props
  const className = props.className ?? "w-full";
  const tableClassName =
    props.tableClassName ?? "min-w-full divide-y divide-gray-200";
  const headerClassName = props.headerClassName ?? "bg-gray-50";
  const bodyClassName =
    props.bodyClassName ?? "bg-white divide-y divide-gray-200";
  const rowClassName = props.rowClassName ?? "";
  const cellClassName =
    props.cellClassName ?? "px-6 py-4 whitespace-nowrap text-sm text-gray-500";
  const columnResizeMode = props.columnResizeMode ?? "onChange";

  // Feature Props
  const enablePagination = props.enablePagination ?? true;
  const enableSorting = props.enableSorting ?? true;
  const enableMultiSort = props.enableMultiSort ?? true;
  const enableColumnFilters = props.enableColumnFilters ?? false;
  const enableGlobalFilter = props.enableGlobalFilter ?? false;
  const enableColumnResizing = props.enableColumnResizing ?? false;
  const enableRowSelection = props.enableRowSelection ?? false;
  const enableExpanding = props.enableExpanding ?? false;
  const enablePinning = props.enablePinning ?? false;
  const enableStickyHeader = props.enableStickyHeader ?? false;
  const enableGrouping = props.enableGrouping ?? false;

  // Pagination Options
  const pageSizeOptions = props.pageSizeOptions ?? [10, 20, 30, 40, 50];

  // State Props
  const pageSize = props.pageSize ?? 10;
  const pageIndex = props.pageIndex ?? 0;
  const sorting = props.sorting ?? [];
  const columnFilters = props.columnFilters ?? [];
  const globalFilter = props.globalFilter ?? "";
  const columnVisibility = props.columnVisibility ?? {};
  const rowSelection = props.rowSelection ?? {};
  const expanded = props.expanded ?? {};
  const columnOrder = props.columnOrder;
  const columnPinning = props.columnPinning;
  const grouping = props.grouping;

  // Controlled State Handlers
  const onPaginationChange = props.onPaginationChange;
  const onSortingChange = props.onSortingChange;
  const onColumnFiltersChange = props.onColumnFiltersChange;
  const onGlobalFilterChange = props.onGlobalFilterChange;
  const onColumnVisibilityChange = props.onColumnVisibilityChange;
  const onRowSelectionChange = props.onRowSelectionChange;
  const onExpandedChange = props.onExpandedChange;
  const onColumnOrderChange = props.onColumnOrderChange;
  const onColumnPinningChange = props.onColumnPinningChange;
  const onGroupingChange = props.onGroupingChange;

  // Advanced Props
  const manualPagination = props.manualPagination ?? false;
  const manualSorting = props.manualSorting ?? false;
  const manualFiltering = props.manualFiltering ?? false;
  const manualGrouping = props.manualGrouping ?? false;
  const pageCount = props.pageCount ?? -1;

  // Smart default for autoResetPageIndex: false for server-side pagination, true for client-side
  const autoResetPageIndex = props.autoResetPageIndex ?? !manualPagination;

  const globalFilterFn = props.globalFilterFn;

  // Custom Components
  const renderTableHeader = props.renderTableHeader;
  const renderTableFooter = props.renderTableFooter;
  const renderPagination = props.renderPagination ?? DefaultPaginationComponent;
  const renderNoResults = props.renderNoResults ?? DefaultNoResultsComponent;
  const renderExpanded = props.renderExpanded;
  const renderRowSubComponent = props.renderRowSubComponent;
  const renderGroupedCell = props.renderGroupedCell;

  // Custom Event Handlers
  const onRowClick = props.onRowClick;
  const onCellClick = props.onCellClick;
  const onExportData = props.onExportData;

  // Loading State
  const isLoading = props.isLoading ?? false;
  const isPaginationLoading = props.isPaginationLoading ?? false;
  const loadingComponent = props.loadingComponent ?? (
    <DefaultLoadingComponent />
  );
  const paginationLoadingComponent = props.paginationLoadingComponent ?? (
    <DefaultPaginationLoadingComponent />
  );
  const showOverlayLoading = props.showOverlayLoading ?? false;

  // Accessibility
  const ariaLabel = props.ariaLabel;
  const ariaLabelledBy = props.ariaLabelledBy;
  const ariaDescribedBy = props.ariaDescribedBy;

  // Sorting Customization
  const renderSortIcon = props.renderSortIcon;
  const enableSortingRemoval = props.enableSortingRemoval ?? true;

  // Use direct state management instead of complex controlled state hook
  const [paginationState, setPaginationState] = useState({
    pageIndex,
    pageSize,
  });
  const [sortingState, setSortingState] = useState(sorting);
  const [columnFiltersState, setColumnFiltersState] = useState(columnFilters);
  const [globalFilterState, setGlobalFilterState] = useState(globalFilter);
  const [columnVisibilityState, setColumnVisibilityState] =
    useState(columnVisibility);
  const [rowSelectionState, setRowSelectionState] = useState(rowSelection);
  const [expandedState, setExpandedState] = useState(expanded);
  const [columnOrderState, setColumnOrderState] = useState(columnOrder || []);
  const [columnPinningState, setColumnPinningState] = useState(
    columnPinning || { left: [], right: [] }
  );
  const [groupingState, setGroupingState] = useState(grouping || []);

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

  // Use props for controlled state, internal state for uncontrolled
  const currentPagination = isControlled.pagination
    ? { pageIndex, pageSize }
    : paginationState;
  const currentSorting = isControlled.sorting ? sorting : sortingState;
  const currentColumnFilters = isControlled.columnFilters
    ? columnFilters
    : columnFiltersState;
  const currentGlobalFilter = isControlled.globalFilter
    ? globalFilter
    : globalFilterState;
  const currentColumnVisibility = isControlled.columnVisibility
    ? columnVisibility
    : columnVisibilityState;
  const currentRowSelection = isControlled.rowSelection
    ? rowSelection
    : rowSelectionState;
  const currentExpanded = isControlled.expanded ? expanded : expandedState;
  const currentColumnOrder = isControlled.columnOrder
    ? columnOrder || []
    : columnOrderState;
  const currentColumnPinning = isControlled.columnPinning
    ? columnPinning || { left: [], right: [] }
    : columnPinningState;
  const currentGrouping = isControlled.grouping
    ? grouping || []
    : groupingState;

  // Create wrapper functions for controlled state
  const handlePaginationChange = useCallback(
    (updater: any) => {
      if (isControlled.pagination) {
        // Controlled mode - just call the callback
        const newState =
          typeof updater === "function" ? updater(currentPagination) : updater;
        onPaginationChange!(newState);
      } else {
        // Uncontrolled mode - update internal state
        setPaginationState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.pagination, currentPagination, onPaginationChange]
  );

  const handleSortingChange = useCallback(
    (updater: any) => {
      if (isControlled.sorting) {
        const newState =
          typeof updater === "function" ? updater(currentSorting) : updater;
        onSortingChange!(newState);
      } else {
        setSortingState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.sorting, currentSorting, onSortingChange]
  );

  const handleColumnFiltersChange = useCallback(
    (updater: any) => {
      if (isControlled.columnFilters) {
        const newState =
          typeof updater === "function"
            ? updater(currentColumnFilters)
            : updater;
        onColumnFiltersChange!(newState);
      } else {
        setColumnFiltersState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.columnFilters, currentColumnFilters, onColumnFiltersChange]
  );

  const handleGlobalFilterChange = useCallback(
    (updater: any) => {
      if (isControlled.globalFilter) {
        const newState =
          typeof updater === "function"
            ? updater(currentGlobalFilter)
            : updater;
        onGlobalFilterChange!(newState);
      } else {
        setGlobalFilterState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.globalFilter, currentGlobalFilter, onGlobalFilterChange]
  );

  const handleColumnVisibilityChange = useCallback(
    (updater: any) => {
      if (isControlled.columnVisibility) {
        const newState =
          typeof updater === "function"
            ? updater(currentColumnVisibility)
            : updater;
        onColumnVisibilityChange!(newState);
      } else {
        setColumnVisibilityState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [
      isControlled.columnVisibility,
      currentColumnVisibility,
      onColumnVisibilityChange,
    ]
  );

  const handleRowSelectionChange = useCallback(
    (updater: any) => {
      if (isControlled.rowSelection) {
        const newState =
          typeof updater === "function"
            ? updater(currentRowSelection)
            : updater;
        onRowSelectionChange!(newState);
      } else {
        setRowSelectionState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.rowSelection, currentRowSelection, onRowSelectionChange]
  );

  const handleExpandedChange = useCallback(
    (updater: any) => {
      if (isControlled.expanded) {
        const newState =
          typeof updater === "function" ? updater(currentExpanded) : updater;
        onExpandedChange!(newState);
      } else {
        setExpandedState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.expanded, currentExpanded, onExpandedChange]
  );

  const handleColumnOrderChange = useCallback(
    (updater: any) => {
      if (isControlled.columnOrder) {
        const newState =
          typeof updater === "function" ? updater(currentColumnOrder) : updater;
        onColumnOrderChange!(newState);
      } else {
        setColumnOrderState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.columnOrder, currentColumnOrder, onColumnOrderChange]
  );

  const handleColumnPinningChange = useCallback(
    (updater: any) => {
      if (isControlled.columnPinning) {
        const newState =
          typeof updater === "function"
            ? updater(currentColumnPinning)
            : updater;
        onColumnPinningChange!(newState);
      } else {
        setColumnPinningState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.columnPinning, currentColumnPinning, onColumnPinningChange]
  );

  const handleGroupingChange = useCallback(
    (updater: any) => {
      if (isControlled.grouping) {
        const newState =
          typeof updater === "function" ? updater(currentGrouping) : updater;
        onGroupingChange!(newState);
      } else {
        setGroupingState((prevState) => {
          const newState =
            typeof updater === "function" ? updater(prevState) : updater;
          return newState;
        });
      }
    },
    [isControlled.grouping, currentGrouping, onGroupingChange]
  );

  // Create memoized data
  const tableData = useMemo(() => data, [data]);

  // Create the table instance
  const table = useReactTable({
    data: tableData,
    columns,

    // Feature enablers
    enableSorting,
    enableMultiSort,
    enableColumnFilters,
    enableGlobalFilter,
    enableRowSelection,
    enableExpanding,
    enableColumnResizing,
    enablePinning,
    enableGrouping,
    enableSortingRemoval,

    // State
    state: {
      sorting: currentSorting,
      columnFilters: currentColumnFilters,
      globalFilter: currentGlobalFilter,
      pagination: currentPagination,
      columnVisibility: currentColumnVisibility,
      rowSelection: currentRowSelection,
      expanded: currentExpanded,
      columnOrder: currentColumnOrder,
      columnPinning: currentColumnPinning,
      grouping: currentGrouping,
    },

    // Controlled state handlers
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: handlePaginationChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
    onExpandedChange: handleExpandedChange,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnPinningChange: handleColumnPinningChange,
    onGroupingChange: handleGroupingChange,

    // Row model getters
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),

    // Advanced options
    manualPagination,
    manualSorting,
    manualFiltering,
    manualGrouping,
    autoResetPageIndex,
    pageCount: pageCount > 0 ? pageCount : undefined,
    globalFilterFn,
    columnResizeMode,
    getRowId,

    // Debug
    debugTable,

    // Add meta data for cell updates if needed
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // This is just a placeholder for implementing cell updates
        console.log("Update data", rowIndex, columnId, value);
      },
    },
  });

  // If loading and not showing as overlay, show loading component

  // Render the table (including when loading with showOverlayLoading=false)
  return (
    <div className={className} id={id}>
      {/* Custom Table Header */}
      {renderTableHeader && renderTableHeader(table)}

      {/* Main Table */}
      <div
        className={`overflow-x-auto relative ${
          showOverlayLoading && isLoading ? "opacity-60" : ""
        }`}
      >
        {showOverlayLoading && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            {loadingComponent}
          </div>
        )}
        <table
          className={tableClassName}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <thead
            className={`${headerClassName} ${
              enableStickyHeader ? "sticky top-0 z-10" : ""
            }`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      width: header.getSize(),
                      position: "relative",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          enableSorting && header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {renderSortIcon
                          ? renderSortIcon(
                              header.column.getIsSorted() as
                                | "asc"
                                | "desc"
                                | false
                            )
                          : { asc: " 🔼", desc: " 🔽" }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                      </div>
                    )}
                    {/* Resizer */}
                    {enableColumnResizing && header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize touch-none select-none ${
                          header.column.getIsResizing() ? "bg-blue-500" : ""
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={bodyClassName}>
            {/* Show loading indicator when initially loading with no data */}
            {isLoading && !showOverlayLoading && data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    table.getAllColumns().filter((col) => col.getIsVisible())
                      .length
                  }
                  className="px-6 py-12 text-center"
                >
                  {loadingComponent}
                </td>
              </tr>
            ) : isPaginationLoading &&
              !showOverlayLoading &&
              data.length > 0 ? (
              <>
                {/* Show existing data with reduced opacity */}
                <tr>
                  <td
                    colSpan={
                      table.getAllColumns().filter((col) => col.getIsVisible())
                        .length
                    }
                    className="px-6 py-2 text-center border-b"
                  >
                    {paginationLoadingComponent}
                  </td>
                </tr>
                {table.getRowModel().rows.map((row) => {
                  const rowClassNameValue =
                    typeof rowClassName === "function"
                      ? rowClassName(row)
                      : rowClassName;

                  return (
                    <tr
                      key={row.id}
                      className={`${rowClassNameValue} opacity-50`}
                    >
                      {/* Row cells rendered with reduced opacity */}
                      {row.getVisibleCells().map((cell) => {
                        const cellClassNameValue =
                          typeof cellClassName === "function"
                            ? cellClassName(row, cell.column.id)
                            : cellClassName;

                        return (
                          <td key={cell.id} className={cellClassNameValue}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            ) : table.getRowModel().rows.length === 0 ? (
              renderNoResults ? (
                renderNoResults(table)
              ) : (
                <tr>
                  <td
                    colSpan={
                      table.getAllColumns().filter((col) => col.getIsVisible())
                        .length
                    }
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <DefaultNoResultsComponent />
                  </td>
                </tr>
              )
            ) : (
              table.getRowModel().rows.map((row) => {
                const rowClassNameValue =
                  typeof rowClassName === "function"
                    ? rowClassName(row)
                    : rowClassName;

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={rowClassNameValue}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const cellClassNameValue =
                          typeof cellClassName === "function"
                            ? cellClassName(row, cell.column.id)
                            : cellClassName;

                        return (
                          <td
                            key={cell.id}
                            className={cellClassNameValue}
                            onClick={
                              onCellClick
                                ? () => onCellClick(row, cell.column.id)
                                : undefined
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Expanded Row Content */}
                    {enableExpanding &&
                      row.getIsExpanded() &&
                      renderRowSubComponent && (
                        <tr>
                          <td colSpan={row.getVisibleCells().length}>
                            {renderRowSubComponent(row)}
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Table Footer */}
      {renderTableFooter && renderTableFooter(table)}

      {/* Pagination */}
      {enablePagination &&
        renderPagination &&
        renderPagination({
          table,
          totalRowCount,
          isLoading: isPaginationLoading,
          pageSizeOptions,
        })}
    </div>
  );
}
