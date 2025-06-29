import { Table as TanStackTable } from "@tanstack/react-table";

export const EnhancedLoadingComponent = () => (
  <div className="flex flex-col items-center justify-center h-24">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
    <span className="text-sm text-gray-700 font-medium">Loading data...</span>
  </div>
);

// Improved Default pagination loading component - replace your existing one
export const EnhancedPaginationLoadingComponent = () => (
  <div className="absolute inset-0 flex items-center justify-center z-10 bg-[rgba(255, 255, 255, 0.5)]">
    <div className="flex flex-col items-center justify-center p-6 ">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-2"></div>
      <span className="text-base font-medium text-blue-700">
        Updating results...
      </span>
    </div>
  </div>
);

// Default loading component
export const DefaultLoadingComponent = () => (
  <div className="flex flex-col items-center justify-center h-24 default-loading-component">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
    <span className="text-sm text-gray-700 font-medium">Loading data...</span>
  </div>
);

// Improved Default pagination loading component - replace your existing one
export const DefaultPaginationLoadingComponent = () => (
  <div className="flex items-center justify-center z-10 bg-[rgba(255, 255, 255, 0.5)] default-pagination-loading-component">
    <div className="flex items-center justify-center space-x-2 ">
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
      <span className="text-base font-medium text-blue-700">
        Updating results...
      </span>
    </div>
  </div>
);

// Default no results component
export const DefaultNoResultsComponent = () => (
  <tr>
    <td>
      <div className="flex justify-center items-center h-24 text-gray-500">
        No results found
      </div>
    </td>
  </tr>
);

// Default pagination component
export const DefaultPaginationComponent = <TData extends object>({
  table,
  totalRowCount,
  isLoading,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: {
  table: TanStackTable<TData>;
  totalRowCount?: number;
  isLoading?: boolean;
  pageSizeOptions?: number[];
}) => {
  const totalRows =
    totalRowCount !== undefined
      ? totalRowCount
      : table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                totalRows
              )}
            </span>{" "}
            of <span className="font-medium">{totalRows}</span> results
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"<<"}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"<"}
            </button>
            <span className="flex items-center gap-1">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mx-1"></div>
              ) : (
                <span>Page</span>
              )}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {">"}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {">>"}
            </button>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              disabled={isLoading}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
