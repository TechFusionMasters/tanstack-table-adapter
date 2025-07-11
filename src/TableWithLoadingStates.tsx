import React from "react";
import {
  EnhancedLoadingComponent,
  EnhancedPaginationLoadingComponent,
} from "./components";

// For TableWithLoadingStates
/**
 * Wrapper component that manages loading states for TableAdapter
 *
 * This component separates loading UI concerns from the table component itself,
 * providing a clean way to handle initial loading and pagination loading states.
 *
 * @example
 * ```tsx
 * <TableWithLoadingStates
 *   isInitialLoading={isLoading}
 *   isPaginationLoading={isPaginating}
 * >
 *   <TableAdapter data={data} columns={columns} />
 * </TableWithLoadingStates>
 * ```
 */
export function TableWithLoadingStates({
  isInitialLoading = false,
  isPaginationLoading = false,
  loadingComponent,
  paginationLoadingComponent,
  children,
}: {
  isInitialLoading?: boolean;
  isPaginationLoading?: boolean;
  loadingComponent?: React.ReactNode;
  paginationLoadingComponent?: React.ReactNode;
  children: React.ReactNode;
}) {
  // Use provided components or fall back to defaults
  const LoadingUI = loadingComponent || <EnhancedLoadingComponent />;
  const PaginationLoadingUI = paginationLoadingComponent || (
    <EnhancedPaginationLoadingComponent />
  );

  return (
    <div className="relative">
      {/* Initial loading overlay - full screen blur with spinner */}
      {isInitialLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm z-10">
          {LoadingUI}
        </div>
      )}

      {/* Pagination loading indicator - top bar only */}
      {!isInitialLoading && isPaginationLoading && <>{PaginationLoadingUI}</>}

      {/* Render table with slight opacity during loading */}
      <div
        className={
          isPaginationLoading
            ? "opacity-70 transition-opacity duration-200"
            : ""
        }
      >
        {children}
      </div>
    </div>
  );
}
