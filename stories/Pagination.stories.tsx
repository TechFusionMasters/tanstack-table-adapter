import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src";
import { columns, mediumDataSet, largeDataSet, Person } from "./mockData";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

const meta: Meta<typeof TableAdapter<Person>> = {
  title: "TableAdapter/Pagination",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Examples showcasing the pagination capabilities of TableAdapter.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * Default pagination example with automatic page count calculation.
 * This shows the basic pagination functionality using the built-in pagination component.
 */
export const BasicPagination: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      pagination: true,
    },
    className: "w-full max-w-4xl",
    classNames: {
      table: "min-w-full divide-y divide-gray-200",
    },
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Example with configurable page sizes allowing users to choose how many rows to display per page.
 */
export const CustomPageSizes: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      pagination: true,
    },
    className: "w-full max-w-4xl",
    state: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    render: {
      renderPagination: ({ table, totalRowCount, isLoading }) => (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
              className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
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
                    totalRowCount || table.getFilteredRowModel().rows.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {totalRowCount || table.getFilteredRowModel().rows.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="block px-3 py-2 text-sm bg-white border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {[5, 10, 15, 20, 25, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
                <nav
                  className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage() || isLoading}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">First</span>⟪
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage() || isLoading}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>⟨
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                    {isLoading ? (
                      <div className="w-4 h-4 mx-1 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    ) : (
                      <span>
                        Page{" "}
                        <strong>
                          {table.getState().pagination.pageIndex + 1}
                        </strong>{" "}
                        of <strong>{table.getPageCount()}</strong>
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage() || isLoading}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>⟩
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage() || isLoading}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Last</span>⟫
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Shows pagination with loading states.
 * Demonstrates how loading indicators are displayed during pagination.
 */
export const PaginationWithLoadingState: Story = {
  render: (args) => {
    const [isLoading, setIsLoading] = React.useState(false);

    // Custom pagination handler that shows loading state
    const handlePaginationChange = async (updater) => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsLoading(false);
    };

    return (
      <TableAdapter
        {...args}
        loading={{
          isPaginationLoading: isLoading,
        }}
        onStateChange={{
          onPaginationChange: handlePaginationChange,
        }}
        totalRowCount={mediumDataSet.length}
      />
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      pagination: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
};
