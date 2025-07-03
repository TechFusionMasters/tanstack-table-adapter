import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanStackTable,
  RowData,
  Row,
} from "@tanstack/react-table";

// Import types
import {
  TableAdapterProps,
  TableFeatures,
  TableStyling,
  TableLoading,
  TableServer,
  TableAccessibility,
  TableAnimations,
  TableVirtualization,
  TableExportOptions,
  TableFormIntegration,
} from "./types";

// Import hooks and utilities
import {
  useTableState,
  useServerSideData,
  useTableExport,
  useTableForm,
} from "./hooks";
import { mergeClassNames, extractFeatureFlags } from "./utils";
import { useDefaultTableClassNames } from "./TableConfigContext";

// Import default components
import {
  DefaultLoadingComponent,
  DefaultPaginationLoadingComponent,
  DefaultNoResultsComponent,
  DefaultPaginationComponent,
} from "./components";

// Use React.memo for performance optimization
// Use React.memo for performance optimization
function TableHeader<TData>({
  table,
  headerClassName,
  enableSorting = false,
  enableStickyHeader = false,
  enableColumnResizing = false,
  renderSortIcon,
  headerStyle,
}: {
  table: TanStackTable<TData>;
  headerClassName: string;
  enableSorting?: boolean;
  enableStickyHeader?: boolean;
  enableColumnResizing?: boolean;
  renderSortIcon?: (direction: "asc" | "desc" | false) => React.ReactNode;
  headerStyle?: React.CSSProperties;
}) {
  return (
    <thead
      className={`${headerClassName} ${
        enableStickyHeader ? "sticky top-0 z-10" : ""
      }`}
      style={headerStyle}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              colSpan={header.colSpan}
              className={header.column.columnDef.meta?.headerClassName || ""}
              style={{
                width: header.getSize(),
                position: "relative",
                ...(header.column.columnDef.meta?.headerStyle || {}),
              }}
            >
              {header.isPlaceholder ? null : (
                <div
                  className={
                    enableSorting && header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : ""
                  }
                  onClick={(e) => {
                    console.log(
                      "Header clicked:",
                      header.column.id,
                      "Event:",
                      e
                    );
                    const handler = header.column.getToggleSortingHandler();
                    if (handler) {
                      handler(e);
                    }
                  }}
                  role={
                    enableSorting && header.column.getCanSort()
                      ? "button"
                      : undefined
                  }
                  aria-label={
                    enableSorting && header.column.getCanSort()
                      ? `Sort by ${header.column.id}`
                      : undefined
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {renderSortIcon
                    ? renderSortIcon(
                        header.column.getIsSorted() as "asc" | "desc" | false
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
                  aria-label={`Resize ${header.column.id} column`}
                />
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

// Row component with memo for performance
const TableRow = React.memo(
  ({
    row,
    rowClassName,
    cellClassName,
    onRowClick,
    onCellClick,
    rowStyle,
    cellStyle,
  }: {
    row: Row<any>;
    rowClassName: string;
    cellClassName: string;
    onRowClick?: (row: Row<any>) => void;
    onCellClick?: (row: Row<any>, columnId: string) => void;
    rowStyle?: React.CSSProperties | ((row: Row<any>) => React.CSSProperties);
    cellStyle?:
      | React.CSSProperties
      | ((row: Row<any>, columnId: string) => React.CSSProperties);
  }) => {
    const computedRowStyle = useMemo(() => {
      if (typeof rowStyle === "function") {
        return rowStyle(row);
      }
      return rowStyle;
    }, [row, rowStyle]);

    return (
      <tr
        className={`${rowClassName} ${row.getIsSelected() ? "selected" : ""}`}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        style={computedRowStyle}
        data-testid={`row-${row.id}`}
        role="row"
      >
        {row.getVisibleCells().map((cell) => {
          const computedCellStyle = useMemo(() => {
            if (typeof cellStyle === "function") {
              return cellStyle(row, cell.column.id);
            }
            return cellStyle;
          }, [cell.column.id]);

          return (
            <td
              key={cell.id}
              className={`${cellClassName} ${
                cell.column.columnDef.meta?.cellClassName || ""
              }`}
              onClick={
                onCellClick
                  ? (e) => {
                      e.stopPropagation(); // Prevent row click handler from firing
                      onCellClick(row, cell.column.id);
                    }
                  : undefined
              }
              style={{
                ...(cell.column.columnDef.meta?.cellStyle || {}),
                ...computedCellStyle,
              }}
              data-testid={`cell-${row.id}-${cell.column.id}`}
              role="cell"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        })}
      </tr>
    );
  }
);

// Expanded row component
const ExpandedRow = React.memo(
  ({
    row,
    colSpan,
    renderRowSubComponent,
  }: {
    row: Row<any>;
    colSpan: number;
    renderRowSubComponent: (row: Row<any>) => React.ReactNode;
  }) => {
    return (
      <tr>
        <td colSpan={colSpan} className="expanded-row">
          {renderRowSubComponent(row)}
        </td>
      </tr>
    );
  }
);
/**
 * TableAdapter - A comprehensive wrapper around TanStack Table v8.0.0
 *
 * Provides a simplified API with extensive customization options while
 * leveraging TanStack Table's powerful core functionality.
 *
 * @template TData - The type of data being displayed in the table
 * @template TValue - The type of values in the table cells
 *
 * @example
 * ```tsx
 * <TableAdapter
 *   data={users}
 *   columns={[
 *     { accessorKey: 'name', header: 'Name' },
 *     { accessorKey: 'email', header: 'Email' },
 *   ]}
 * />
 * ```
 */
export function TableAdapter<TData extends object, TValue = unknown>(
  props: TableAdapterProps<TData, TValue>
) {
  // Extract core props
  const {
    data: initialData,
    columns: propColumns,
    totalRowCount: propTotalRowCount,
    id,
    debugTable,
    getRowId,
    error: propError,
  } = props;

  // Get default classNames from context or fallback to defaults
  const defaultClassNames = useDefaultTableClassNames();

  // Extract styling props (grouped or legacy)
  const styling: TableStyling = {
    className: props.styling?.className ?? props.className ?? "w-full",
    classNames: props.styling?.classNames ?? props.classNames,
    columnResizeMode:
      props.styling?.columnResizeMode ?? props.columnResizeMode ?? "onChange",
    style: props.styling?.style,
    headerStyle: props.styling?.headerStyle,
    rowStyle: props.styling?.rowStyle,
    cellStyle: props.styling?.cellStyle,
  };

  // Extract feature flags (grouped or legacy)
  const features = extractFeatureFlags(props);

  // Extract loading state props (grouped or legacy)
  const loading: TableLoading = {
    isLoading: props.loading?.isLoading ?? props.isLoading ?? false,
    isPaginationLoading:
      props.loading?.isPaginationLoading ?? props.isPaginationLoading ?? false,
    isSortingLoading: props.loading?.isSortingLoading ?? false,
    isFilteringLoading: props.loading?.isFilteringLoading ?? false,
    isExportLoading: props.loading?.isExportLoading ?? false,
    showOverlayLoading:
      props.loading?.showOverlayLoading ?? props.showOverlayLoading ?? false,
    loadingComponent: props.loading?.loadingComponent ??
      props.loadingComponent ?? <DefaultLoadingComponent />,
    paginationLoadingComponent: props.loading?.paginationLoadingComponent ??
      props.paginationLoadingComponent ?? <DefaultPaginationLoadingComponent />,
  };

  // Extract server-side props (grouped or legacy)
  const server: TableServer = {
    manualPagination:
      props.server?.manualPagination ?? props.manualPagination ?? false,
    manualSorting: props.server?.manualSorting ?? props.manualSorting ?? false,
    manualFiltering:
      props.server?.manualFiltering ?? props.manualFiltering ?? false,
    manualGrouping:
      props.server?.manualGrouping ?? props.manualGrouping ?? false,
    pageCount: props.server?.pageCount ?? props.pageCount ?? -1,
    autoResetPageIndex:
      props.server?.autoResetPageIndex ??
      props.autoResetPageIndex ??
      !(props.server?.manualPagination ?? props.manualPagination ?? false),
    fetchData: props.server?.fetchData,
    onFetchError: props.server?.onFetchError,
  };

  // Extract accessibility props (grouped or legacy)
  const accessibility: TableAccessibility = {
    ariaLabel: props.accessibility?.ariaLabel ?? props.ariaLabel,
    ariaLabelledBy: props.accessibility?.ariaLabelledBy ?? props.ariaLabelledBy,
    ariaDescribedBy:
      props.accessibility?.ariaDescribedBy ?? props.ariaDescribedBy,
    ariaRowCount: props.accessibility?.ariaRowCount ?? false,
    ariaColumnCount: props.accessibility?.ariaColumnCount ?? false,
    ariaLiveRegion: props.accessibility?.ariaLiveRegion ?? false,
    keyboardNavigation: props.accessibility?.keyboardNavigation ?? false,
  };

  // Extract animations props
  const animations: TableAnimations = props.animations ?? {
    enableAnimations: false,
    rowAnimationDuration: 300,
    sortAnimationDuration: 200,
    expandAnimationDuration: 300,
    animationLib: "css",
  };

  // Extract virtualization props
  const virtualization: TableVirtualization = props.virtualization ?? {
    rowHeight: 35,
    visibleRows: 10,
    virtualizationLib: "none",
  };

  // Extract export options
  const exportOptions: TableExportOptions = props.exportOptions ?? {
    formats: ["csv"],
    fileName: "export.csv",
    includeHiddenColumns: false,
    exportSelection: false,
  };

  // Extract form integration props
  const formIntegration: TableFormIntegration<TData> =
    props.formIntegration ?? {
      showValidationErrors: true,
    };

  // Extract pagination options
  const pageSizeOptions = props.pageSizeOptions ?? [10, 20, 30, 40, 50];

  // Extract render props (grouped or legacy)
  const renderTableHeader =
    props.render?.renderTableHeader ?? props.renderTableHeader;
  const renderTableFooter =
    props.render?.renderTableFooter ?? props.renderTableFooter;
  const renderPagination =
    props.render?.renderPagination ??
    props.renderPagination ??
    DefaultPaginationComponent;
  const renderNoResults =
    props.render?.renderNoResults ??
    props.renderNoResults ??
    DefaultNoResultsComponent;
  const renderExpanded = props.render?.renderExpanded ?? props.renderExpanded;
  const renderRowSubComponent =
    props.render?.renderRowSubComponent ?? props.renderRowSubComponent;
  const renderGroupedCell =
    props.render?.renderGroupedCell ?? props.renderGroupedCell;
  const renderSortIcon = props.render?.renderSortIcon ?? props.renderSortIcon;
  const renderError = props.render?.renderError;

  // Extract event handlers (grouped or legacy)
  const onRowClick = props.events?.onRowClick ?? props.onRowClick;
  const onCellClick = props.events?.onCellClick ?? props.onCellClick;
  const onExportData = props.events?.onExportData ?? props.onExportData;
  const onError = props.events?.onError;

  // Extract cell edit handler
  const onCellEdit = props.onStateChange?.onCellEdit;

  // State for errors
  const [error, setError] = useState<Error | null>(propError || null);

  // Use custom hooks for state management
  const {
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
  } = useTableState(props);

  // Memoize columns for performance
  const columns = useMemo(() => propColumns, [propColumns]);

  // Memoize data for performance - we'll use this initially then possibly replace with server or form data
  const initialMemoizedData = useMemo(() => initialData, [initialData]);

  // Create a state to track what data is currently being used by the table
  const [tableData, setTableData] = useState<TData[]>(initialMemoizedData);

  // Determine the multi-sort event handler: use prop if provided, otherwise default to Shift key
  const isMultiSortEvent =
    props.isMultiSortEvent ?? ((e: unknown) => !!(e && (e as any).shiftKey));

  // Create the table instance with initial data
  const table = useReactTable({
    data: tableData,
    columns,

    // Feature enablers
    enableSorting: features.sorting,
    enableMultiSort: features.multiSort,
    enableColumnFilters: features.columnFilters,
    enableGlobalFilter: features.globalFilter,
    enableRowSelection: features.rowSelection,
    enableExpanding: features.expanding,
    enableColumnResizing: features.columnResizing,
    enableSortingRemoval: features.sortingRemoval,

    // Advanced multi-sorting options
    isMultiSortEvent,
    maxMultiSortColCount: props.maxMultiSortColCount,
    enableMultiRemove: props.enableMultiRemove,

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
    getSortedRowModel: server.manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: server.manualFiltering
      ? undefined
      : getFilteredRowModel(),
    getPaginationRowModel: server.manualPagination
      ? undefined
      : getPaginationRowModel(),

    // Advanced options
    manualPagination: server.manualPagination,
    manualSorting: server.manualSorting,
    manualFiltering: server.manualFiltering,
    manualGrouping: server.manualGrouping,
    autoResetPageIndex: server.autoResetPageIndex,
    pageCount:
      server.pageCount && server.pageCount > 0 ? server.pageCount : undefined,
    globalFilterFn: props.globalFilterFn,
    columnResizeMode: styling.columnResizeMode,
    getRowId,

    // Debug
    debugTable,

    // Initial meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log("Initial updateData called", rowIndex, columnId, value);
      },
    },
  });

  // Server-side data fetching
  const {
    isLoading: isFetchLoading,
    data: serverData,
    error: fetchError,
    totalRowCount: serverTotalRowCount,
    pageCount: serverPageCount,
  } = useServerSideData(table, server, onError);

  // Form integration
  const {
    formData,
    validationErrors,
    isDirty,
    handleCellChange,
    handleSubmit,
    resetForm,
  } = useTableForm(
    // Use server data if available, otherwise use the original data
    server.fetchData && serverData.length > 0
      ? serverData
      : initialMemoizedData,
    formIntegration.onSubmit,
    formIntegration.validationRules
  );

  // Export utilities
  const { exportToCSV, exportToJSON, handleExport } = useTableExport(
    // Use the current data source for export
    features.formMode
      ? formData
      : server.fetchData && serverData.length > 0
      ? serverData
      : tableData,
    columns,
    exportOptions
  );

  // Update table data based on data source
  useEffect(() => {
    let dataToUse: TData[];

    if (features.formMode) {
      // In form mode, use form data
      dataToUse = formData;
    } else if (server.fetchData && serverData.length > 0) {
      // If using server-side data and we have results, use that
      dataToUse = serverData;
    } else {
      // Otherwise use original data
      dataToUse = initialMemoizedData;
    }

    setTableData(dataToUse);

    // We also need to update the table's data
    table.setOptions((prev) => ({
      ...prev,
      data: dataToUse,
      pageCount: serverPageCount > 0 ? serverPageCount : undefined,
    }));
  }, [
    features.formMode,
    formData,
    server.fetchData,
    serverData,
    serverPageCount,
    initialMemoizedData,
    table,
  ]);

  // Update meta.updateData to use form or cell edit handler
  useEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        updateData: (rowIndex, columnId, value) => {
          if (features.formMode) {
            handleCellChange(rowIndex, columnId, value);
          } else if (onCellEdit) {
            onCellEdit(rowIndex, columnId, value);
          } else {
            console.log("Update data", rowIndex, columnId, value);
          }
        },
      },
    }));
  }, [features.formMode, handleCellChange, onCellEdit, table]);

  // Handle error updates from props
  useEffect(() => {
    if (propError) {
      setError(propError);
      if (onError) {
        onError(propError);
      }
    }
  }, [propError, onError]);

  // Combine errors
  useEffect(() => {
    if (fetchError && !error) {
      setError(fetchError);
      if (onError) {
        onError(fetchError);
      }
    }
  }, [fetchError, error, onError]);

  // Combine loading states
  const isTableLoading = loading.isLoading || isFetchLoading;
  const isPaginationLoading =
    loading.isPaginationLoading || (isFetchLoading && server.manualPagination);

  // Determine total row count
  const totalRowCount =
    propTotalRowCount ??
    serverTotalRowCount ??
    table.getFilteredRowModel().rows.length;

  // Merge classNames with proper precedence
  const mergedClassNames = mergeClassNames(
    defaultClassNames,
    styling.classNames
  );

  // If there's an error and renderError is provided, show error state
  if (error && renderError) {
    return renderError(error);
  }

  // Setup export functionality
  useEffect(() => {
    if (onExportData) {
      // Extend table meta with export function
      table.setOptions((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          exportData: () => {
            if (exportOptions.formats && exportOptions.formats[0] === "json") {
              exportToJSON();
            } else {
              exportToCSV();
            }

            // Call onExportData with current data
            const currentData = features.formMode
              ? formData
              : server.fetchData && serverData.length > 0
              ? serverData
              : tableData;

            onExportData(currentData);
          },
        },
      }));
    }
  }, [
    onExportData,
    exportOptions.formats,
    exportToCSV,
    exportToJSON,
    features.formMode,
    formData,
    server.fetchData,
    serverData,
    tableData,
    table,
  ]);

  // Keyboard navigation handler for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!accessibility.keyboardNavigation) return;

      // Navigation keys
      switch (e.key) {
        case "Home":
          table.setPageIndex(0);
          e.preventDefault();
          break;
        case "End":
          table.setPageIndex(table.getPageCount() - 1);
          e.preventDefault();
          break;
        case "PageUp":
          if (table.getCanPreviousPage()) {
            table.previousPage();
            e.preventDefault();
          }
          break;
        case "PageDown":
          if (table.getCanNextPage()) {
            table.nextPage();
            e.preventDefault();
          }
          break;
      }
    },
    [table, accessibility.keyboardNavigation]
  );

  // Main render function
  const TableComponent = (
    <div
      className={styling.className}
      id={id}
      style={styling.style}
      onKeyDown={handleKeyDown}
    >
      {/* Custom Table Header */}
      {renderTableHeader && renderTableHeader(table)}

      {/* Main Table */}
      <div
        className={`overflow-x-auto relative ${
          loading.showOverlayLoading && isTableLoading ? "opacity-60" : ""
        }`}
      >
        {loading.showOverlayLoading && isTableLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            {loading.loadingComponent}
          </div>
        )}
        <table
          className={mergedClassNames.table}
          aria-label={accessibility.ariaLabel}
          aria-labelledby={accessibility.ariaLabelledBy}
          aria-describedby={accessibility.ariaDescribedBy}
          role="grid"
          {...(accessibility.ariaRowCount
            ? { "aria-rowcount": totalRowCount }
            : {})}
          {...(accessibility.ariaColumnCount
            ? { "aria-colcount": table.getAllColumns().length }
            : {})}
        >
          {/* Table Header */}
          <TableHeader
            table={table}
            headerClassName={mergedClassNames.thead}
            enableSorting={!!features.sorting}
            enableStickyHeader={!!features.stickyHeader}
            enableColumnResizing={!!features.columnResizing}
            renderSortIcon={renderSortIcon}
            headerStyle={styling.headerStyle}
          />

          {/* Table Body */}
          <tbody className={mergedClassNames.tbody}>
            {/* Show loading indicator when initially loading with no data */}
            {isTableLoading &&
            !loading.showOverlayLoading &&
            tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    table.getAllColumns().filter((col) => col.getIsVisible())
                      .length
                  }
                  className="px-6 py-12 text-center"
                >
                  {loading.loadingComponent}
                </td>
              </tr>
            ) : isPaginationLoading &&
              !loading.showOverlayLoading &&
              tableData.length > 0 ? (
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
                    {loading.paginationLoadingComponent}
                  </td>
                </tr>
                {table.getRowModel().rows.map((row) => {
                  // Use a key that includes selection state for loading rows
                  const isSelected = row.getIsSelected();
                  const rowKey = `${row.id}-${
                    isSelected ? "selected" : "unselected"
                  }-loading`;

                  return (
                    <TableRow
                      key={rowKey}
                      row={row}
                      rowClassName={`${mergedClassNames.tbodyRow} opacity-50`}
                      cellClassName={mergedClassNames.tbodyCell}
                      rowStyle={styling.rowStyle}
                      cellStyle={styling.cellStyle}
                    />
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
              // Regular data rows
              table.getRowModel().rows.map((row) => {
                // Generate a key that includes the selection state
                const isSelected = row.getIsSelected();
                const rowKey = `${row.id}-${
                  isSelected ? "selected" : "unselected"
                }`;

                return (
                  <React.Fragment key={rowKey}>
                    <TableRow
                      row={row}
                      rowClassName={mergedClassNames.tbodyRow}
                      cellClassName={mergedClassNames.tbodyCell}
                      onRowClick={onRowClick}
                      onCellClick={onCellClick}
                      rowStyle={styling.rowStyle}
                      cellStyle={styling.cellStyle}
                    />
                    {/* Expanded Row Content */}
                    {features.expanding &&
                      row.getIsExpanded() &&
                      renderRowSubComponent && (
                        <ExpandedRow
                          row={row}
                          colSpan={row.getVisibleCells().length}
                          renderRowSubComponent={renderRowSubComponent}
                        />
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
      {features.pagination &&
        renderPagination &&
        renderPagination({
          table,
          totalRowCount,
          isLoading: isPaginationLoading,
          pageSizeOptions,
        })}

      {/* Export Buttons - only shown if export formats are defined and no onExportData handler */}
      {exportOptions.formats &&
        exportOptions.formats.length > 0 &&
        !onExportData && (
          <div className="mt-4 flex justify-end space-x-2">
            {exportOptions.formats.includes("csv") && (
              <button
                type="button"
                onClick={() => exportToCSV()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Export to CSV
              </button>
            )}
            {exportOptions.formats.includes("json") && (
              <button
                type="button"
                onClick={() => exportToJSON()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Export to JSON
              </button>
            )}
          </div>
        )}

      {/* Form mode buttons */}
      {features.formMode && isDirty && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={Object.keys(validationErrors).length > 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Validation errors summary - only shown if form mode is enabled and showValidationErrors is true */}
      {features.formMode &&
        formIntegration.showValidationErrors &&
        Object.keys(validationErrors).length > 0 && (
          <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded">
            <h3 className="text-red-700 font-medium">
              Please fix the following errors:
            </h3>
            <ul className="mt-2 list-disc pl-5 text-red-600">
              {Object.entries(validationErrors).map(([rowIndex, rowErrors]) =>
                Object.entries(rowErrors).map(([columnId, error]) => (
                  <li key={`${rowIndex}-${columnId}`}>
                    Row {parseInt(rowIndex) + 1}, {columnId}: {error}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

      {/* Accessibility live region for announcements */}
      {accessibility.ariaLiveRegion && (
        <div className="sr-only" aria-live="polite">
          {isTableLoading
            ? "Loading data..."
            : `Table with ${totalRowCount} rows and ${
                table.getAllColumns().filter((col) => col.getIsVisible()).length
              } columns.`}
        </div>
      )}
    </div>
  );

  // Wrap in form if form mode is enabled
  if (features.formMode) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {TableComponent}
      </form>
    );
  }

  return TableComponent;
}
