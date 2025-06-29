import { ColumnDef, FilterFn } from "@tanstack/react-table";

// Utility filter functions
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
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

// Utility function to export table data to CSV
export const exportToCSV = <TData extends object>(
  data: TData[],
  columns: ColumnDef<TData, any>[],
  filename = "export.csv"
) => {
  // Get all leaf column headers
  const headers = columns
    .filter((col) => !("columns" in col && col.columns)) // Only leaf columns
    .map((col) => {
      const header =
        typeof col.header === "string"
          ? col.header
          : col.id || String("accessorKey" in col ? col.accessorKey : "");
      return header;
    });

  // Format data rows
  const rows = data.map((item) => {
    return columns
      .filter((col) => !("columns" in col && col.columns)) // Only leaf columns
      .map((col) => {
        // Get the value from the data using accessorKey or accessorFn
        let value: any = "";
        if ("accessorKey" in col && col.accessorKey) {
          const key = String(col.accessorKey);
          value = (item as any)[key];
        } else if ("accessorFn" in col && col.accessorFn) {
          value = col.accessorFn(item, 0); // Add index parameter
        } else if (col.id) {
          value = (item as any)[col.id];
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
};

// Export default filter function
export { fuzzyFilter as defaultFilterFn };
