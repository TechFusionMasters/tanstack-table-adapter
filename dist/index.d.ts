import * as react_jsx_runtime from 'react/jsx-runtime';
import { ColumnDef, Row, ColumnResizeMode, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState, ExpandedState, OnChangeFn, PaginationState, FilterFn, Table, RowData } from '@tanstack/react-table';
import React from 'react';

type TableAdapterProps<TData extends object> = {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    totalRowCount?: number;
    id?: string;
    debugTable?: boolean;
    getRowId?: (row: TData, index: number, parent?: Row<TData>) => string;
    className?: string;
    tableClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    rowClassName?: string | ((row: Row<TData>) => string);
    cellClassName?: string | ((row: Row<TData>, columnId: string) => string);
    columnResizeMode?: ColumnResizeMode;
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
    pageSize?: number;
    pageIndex?: number;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    globalFilter?: string;
    columnVisibility?: VisibilityState;
    rowSelection?: RowSelectionState;
    expanded?: ExpandedState;
    columnOrder?: string[];
    columnPinning?: {
        left: string[];
        right: string[];
    };
    grouping?: string[];
    onPaginationChange?: OnChangeFn<PaginationState>;
    onSortingChange?: OnChangeFn<SortingState>;
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    onGlobalFilterChange?: OnChangeFn<string>;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    onExpandedChange?: OnChangeFn<ExpandedState>;
    onColumnOrderChange?: OnChangeFn<string[]>;
    onColumnPinningChange?: OnChangeFn<{
        left: string[];
        right: string[];
    }>;
    onGroupingChange?: OnChangeFn<string[]>;
    manualPagination?: boolean;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    manualGrouping?: boolean;
    pageCount?: number;
    autoResetPageIndex?: boolean;
    globalFilterFn?: FilterFn<TData>;
    renderTableHeader?: (table: Table<TData>) => React.ReactNode;
    renderTableFooter?: (table: Table<TData>) => React.ReactNode;
    renderPagination?: (props: {
        table: Table<TData>;
        totalRowCount?: number;
        isLoading?: boolean;
        pageSizeOptions?: number[];
    }) => React.ReactNode;
    renderNoResults?: (table: Table<TData>) => React.ReactNode;
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
    enableSortingRemoval?: boolean;
};

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}
declare function TableAdapter<TData extends object>(props: TableAdapterProps<TData>): react_jsx_runtime.JSX.Element;

/**
 * TableWithLoadingStates - A wrapper component that manages loading states for TableAdapter
 * This separates loading UI concerns from the table component itself
 */
declare function TableWithLoadingStates({ isInitialLoading, isPaginationLoading, loadingComponent, paginationLoadingComponent, children, }: {
    isInitialLoading?: boolean;
    isPaginationLoading?: boolean;
    loadingComponent?: React.ReactNode;
    paginationLoadingComponent?: React.ReactNode;
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;

declare const DefaultPaginationComponent: <TData extends object>({ table, totalRowCount, isLoading, pageSizeOptions, }: {
    table: Table<TData>;
    totalRowCount?: number;
    isLoading?: boolean;
    pageSizeOptions?: number[];
}) => react_jsx_runtime.JSX.Element;

declare const GlobalFilterInput: ({ value, onChange, placeholder, className, }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) => react_jsx_runtime.JSX.Element;
declare const ColumnVisibilityToggle: <TData extends object>({ table, className, }: {
    table: Table<TData>;
    className?: string;
}) => react_jsx_runtime.JSX.Element;

declare const fuzzyFilter: FilterFn<any>;
declare const exportToCSV: <TData extends object>(data: TData[], columns: ColumnDef<TData, any>[], filename?: string) => void;

export { ColumnVisibilityToggle, DefaultPaginationComponent, GlobalFilterInput, TableAdapter, TableWithLoadingStates, exportToCSV, fuzzyFilter };
export type { TableAdapterProps };
