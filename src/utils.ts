import React from "react";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import {
  DefaultTableClassNames,
  TableAdapterProps,
  TableFeatures,
} from "./types";

// Utility filter functions
export const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  // Skip if no value is provided
  if (!value || value === "") return true;

  const getValue = (obj: any, path: string): any => {
    const pathParts = path.split(".");
    let current = obj;
    for (const part of pathParts) {
      if (current === null || current === undefined) return null;
      current = current[part];
    }
    return current;
  };

  const itemValue = getValue(row.original, columnId);

  // Skip if the value is null or undefined
  if (itemValue === null || itemValue === undefined) return false;

  // Convert to string for comparison
  const itemStr = String(itemValue).toLowerCase();
  const searchStr = String(value).toLowerCase();

  return itemStr.includes(searchStr);
};

// Utility function to export table data to CSV with enhanced typing
export const exportToCSV = <TData extends object, TValue = unknown>(
  data: TData[],
  columns: ColumnDef<TData, TValue>[],
  options: {
    filename?: string;
    includeHiddenColumns?: boolean;
    exportSelection?: boolean;
    selectedRows?: Record<string, boolean>;
    customFormatter?: (data: any, columnId: string) => string;
  } = {}
) => {
  const {
    filename = "export.csv",
    includeHiddenColumns = false,
    exportSelection = false,
    selectedRows = {},
    customFormatter,
  } = options;

  // Filter data if exporting only selected rows
  const dataToExport = exportSelection
    ? data.filter((_, index) => selectedRows[index])
    : data;

  // Get all leaf column headers, optionally including hidden ones
  const leafColumns = columns.filter(
    (col) =>
      !("columns" in col && col.columns) &&
      (includeHiddenColumns || col.id !== undefined)
  );

  const headers = leafColumns.map((col) => {
    const header =
      typeof col.header === "string"
        ? col.header
        : col.id || String("accessorKey" in col ? col.accessorKey : "");
    return header;
  });

  // Format data rows
  const rows = dataToExport.map((item) => {
    return leafColumns.map((col) => {
      // Get the value from the data using accessorKey or accessorFn
      let value: any = "";

      if ("accessorKey" in col && col.accessorKey) {
        const key = String(col.accessorKey);
        const getValue = (obj: any, path: string): any => {
          const pathParts = path.split(".");
          let current = obj;
          for (const part of pathParts) {
            if (current === null || current === undefined) return null;
            current = current[part];
          }
          return current;
        };
        value = getValue(item, key);
      } else if ("accessorFn" in col && col.accessorFn) {
        value = col.accessorFn(item, 0);
      } else if (col.id) {
        value = (item as any)[col.id];
      }

      // Use custom formatter if provided
      if (customFormatter && col.id) {
        value = customFormatter(value, col.id);
      }

      // Ensure proper CSV formatting with quotes for strings
      if (typeof value === "string") {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    });
  });

  // Combine headers and rows into CSV format
  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  // Create download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up
};

// Export default filter function
export { fuzzyFilter as defaultFilterFn };

// Default classNames for the table components
export const DEFAULT_TABLE_CLASSNAMES: DefaultTableClassNames = {
  table: "min-w-full divide-y divide-gray-200",
  thead: "bg-gray-50",
  theadRow: "",
  theadCell:
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tbody: "bg-white divide-y divide-gray-200",
  tbodyRow: "",
  tbodyCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
  header: "bg-gray-50",
  body: "bg-white divide-y divide-gray-200",
};

// Utility function to merge classNames with proper precedence
export function mergeClassNames(
  defaultClassNames: DefaultTableClassNames,
  componentClassNames?: Partial<DefaultTableClassNames>
): DefaultTableClassNames {
  const merged = { ...defaultClassNames };

  // Apply component-level classNames (highest priority)
  if (componentClassNames) {
    Object.assign(merged, componentClassNames);
  }

  return merged;
}

// Factory function for controlled/uncontrolled state handlers
export function createControlledHandler<T>(
  isControlled: boolean,
  externalHandler: ((value: T) => void) | undefined,
  internalSetter: React.Dispatch<React.SetStateAction<T>>,
  getCurrentValue: () => T
) {
  return (updater: T | ((prev: T) => T)) => {
    const newValue =
      typeof updater === "function"
        ? (updater as (prev: T) => T)(getCurrentValue())
        : updater;

    if (isControlled && externalHandler) {
      externalHandler(newValue);
    } else {
      internalSetter(newValue);
    }
  };
}

// Extract feature flags from props, combining the new grouped structure with legacy props
export function extractFeatureFlags<TData extends object, TValue>(
  props: TableAdapterProps<TData, TValue>
): TableFeatures {
  // Default feature flags
  const features: TableFeatures = {
    pagination: true,
    sorting: true,
    multiSort: true,
    columnFilters: false,
    globalFilter: false,
    columnResizing: false,
    rowSelection: false,
    expanding: false,
    columnOrdering: false,
    pinning: false,
    stickyHeader: false,
    grouping: false,
    formMode: false,
    virtualization: false,
    sortingRemoval: true,
  };

  // Apply from grouped structure if provided
  if (props.features) {
    Object.assign(features, props.features);
  }

  // Legacy props override grouped structure for backward compatibility
  if (props.enablePagination !== undefined)
    features.pagination = props.enablePagination;
  if (props.enableSorting !== undefined) features.sorting = props.enableSorting;
  if (props.enableMultiSort !== undefined)
    features.multiSort = props.enableMultiSort;
  if (props.enableColumnFilters !== undefined)
    features.columnFilters = props.enableColumnFilters;
  if (props.enableGlobalFilter !== undefined)
    features.globalFilter = props.enableGlobalFilter;
  if (props.enableColumnResizing !== undefined)
    features.columnResizing = props.enableColumnResizing;
  if (props.enableRowSelection !== undefined)
    features.rowSelection = props.enableRowSelection;
  if (props.enableExpanding !== undefined)
    features.expanding = props.enableExpanding;
  if (props.enablePinning !== undefined) features.pinning = props.enablePinning;
  if (props.enableStickyHeader !== undefined)
    features.stickyHeader = props.enableStickyHeader;
  if (props.enableGrouping !== undefined)
    features.grouping = props.enableGrouping;
  if (props.enableSortingRemoval !== undefined)
    features.sortingRemoval = props.enableSortingRemoval;

  return features;
}
