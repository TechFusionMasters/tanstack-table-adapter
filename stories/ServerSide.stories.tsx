import React, { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src"; // Adjust import path as needed
import { columns, hugeDataSet, Person } from "./mockData";
import { PaginationState, SortingState } from "@tanstack/react-table";

/**
 * This file demonstrates the server-side capabilities of the TableAdapter component.
 */
const meta: Meta<typeof TableAdapter<Person>> = {
  title: "Components/TableAdapter/Server Side",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TableAdapter supports server-side operations for pagination, sorting, and filtering - which is essential for large datasets.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * A table with server-side pagination.
 */
export const ServerSidePagination: Story = {
  render: () => {
    const [data, setData] = useState<Person[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);

    // Simulate a server-side API call
    useEffect(() => {
      setIsLoading(true);

      // Simulate API delay
      const timer = setTimeout(() => {
        // Get the slice of data for the current page
        const startIndex = pagination.pageIndex * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        const paginatedData = hugeDataSet.slice(startIndex, endIndex);

        setData(paginatedData);
        setTotalRows(hugeDataSet.length);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }, [pagination.pageIndex, pagination.pageSize]);

    return (
      <div className="w-full max-w-4xl">
        <div className="bg-gray-50 p-4 mb-4 rounded text-sm">
          <p>This example demonstrates server-side pagination.</p>
          <p>Current page: {pagination.pageIndex + 1}</p>
          <p>Page size: {pagination.pageSize}</p>
          <p>Total rows: {totalRows}</p>
        </div>

        <TableAdapter
          data={data}
          columns={columns}
          pageCount={Math.ceil(totalRows / pagination.pageSize)}
          manualPagination={true}
          enablePagination={true}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          totalRowCount={totalRows}
          className="w-full"
        />
      </div>
    );
  },
};

/**
 * A table with server-side pagination and sorting.
 */
export const ServerSidePaginationAndSorting: Story = {
  render: () => {
    const [data, setData] = useState<Person[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);

    // Simulate a server-side API call
    useEffect(() => {
      setIsLoading(true);

      // Simulate API delay
      const timer = setTimeout(() => {
        // Clone the data to avoid mutating the original
        let sortedData = [...hugeDataSet];

        // Apply sorting if specified
        if (sorting.length > 0) {
          sortedData = sortedData.sort((a, b) => {
            for (const sort of sorting) {
              const column = sort.id;
              const desc = sort.desc;

              // Handle null or undefined values
              if (a[column] == null && b[column] == null) return 0;
              if (a[column] == null) return desc ? 1 : -1;
              if (b[column] == null) return desc ? -1 : 1;

              // Compare based on data type
              if (typeof a[column] === "string") {
                const compareResult = a[column].localeCompare(b[column]);
                if (compareResult !== 0)
                  return desc ? -compareResult : compareResult;
              } else {
                if (a[column] < b[column]) return desc ? 1 : -1;
                if (a[column] > b[column]) return desc ? -1 : 1;
              }
            }
            return 0;
          });
        }

        // Get the slice of data for the current page
        const startIndex = pagination.pageIndex * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        const paginatedData = sortedData.slice(startIndex, endIndex);

        setData(paginatedData);
        setTotalRows(hugeDataSet.length);
        setIsLoading(false);
      }, 750);

      return () => clearTimeout(timer);
    }, [pagination.pageIndex, pagination.pageSize, sorting]);

    return (
      <div className="w-full max-w-4xl">
        <div className="bg-gray-50 p-4 mb-4 rounded text-sm">
          <p>This example demonstrates server-side pagination and sorting.</p>
          <p>Current page: {pagination.pageIndex + 1}</p>
          <p>Page size: {pagination.pageSize}</p>
          <p>
            Sorting:{" "}
            {sorting.length > 0
              ? sorting
                  .map((s) => `${s.id} (${s.desc ? "desc" : "asc"})`)
                  .join(", ")
              : "None"}
          </p>
          <p>Total rows: {totalRows}</p>
        </div>

        <TableAdapter
          data={data}
          columns={columns}
          pageCount={Math.ceil(totalRows / pagination.pageSize)}
          manualPagination={true}
          manualSorting={true}
          enablePagination={true}
          enableSorting={true}
          enableMultiSort={true}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          sorting={sorting}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          isLoading={isLoading}
          isPaginationLoading={isLoading && data.length > 0}
          totalRowCount={totalRows}
          className="w-full"
        />
      </div>
    );
  },
};

/**
 * A table with server-side pagination, sorting, and filtering.
 */
export const ServerSideComplete: Story = {
  render: () => {
    const [data, setData] = useState<Person[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);

    // Simulate a server-side API call
    useEffect(() => {
      setIsLoading(true);

      // Simulate API delay - longer for more complex operations
      const timer = setTimeout(() => {
        // Clone the data to avoid mutating the original
        let filteredData = [...hugeDataSet];

        // Apply global filtering
        if (globalFilter) {
          const lowerCaseFilter = globalFilter.toLowerCase();
          filteredData = filteredData.filter((row) => {
            return Object.values(row).some((value) => {
              // Skip filtering on complex objects or null values
              if (value === null || typeof value === "object") return false;

              // Convert value to string and check if it includes the filter
              return String(value).toLowerCase().includes(lowerCaseFilter);
            });
          });
        }

        // Apply sorting if specified
        if (sorting.length > 0) {
          filteredData = filteredData.sort((a, b) => {
            for (const sort of sorting) {
              const column = sort.id;
              const desc = sort.desc;

              // Handle null or undefined values
              if (a[column] == null && b[column] == null) return 0;
              if (a[column] == null) return desc ? 1 : -1;
              if (b[column] == null) return desc ? -1 : 1;

              // Compare based on data type
              if (typeof a[column] === "string") {
                const compareResult = a[column].localeCompare(b[column]);
                if (compareResult !== 0)
                  return desc ? -compareResult : compareResult;
              } else {
                if (a[column] < b[column]) return desc ? 1 : -1;
                if (a[column] > b[column]) return desc ? -1 : 1;
              }
            }
            return 0;
          });
        }

        // Calculate total filtered rows
        const totalFilteredRows = filteredData.length;

        // Get the slice of data for the current page
        const startIndex = pagination.pageIndex * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setData(paginatedData);
        setTotalRows(totalFilteredRows);
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter]);

    return (
      <div className="w-full max-w-4xl">
        <div className="bg-gray-50 p-4 mb-4 rounded text-sm">
          <p>
            This example demonstrates complete server-side operations:
            pagination, sorting, and filtering.
          </p>
          <div className="mt-2">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="px-3 py-2 border rounded w-full"
            />
          </div>
        </div>

        <TableAdapter
          data={data}
          columns={columns}
          pageCount={Math.ceil(totalRows / pagination.pageSize)}
          manualPagination={true}
          manualSorting={true}
          manualFiltering={true}
          enablePagination={true}
          enableSorting={true}
          enableMultiSort={true}
          enableGlobalFilter={true}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          sorting={sorting}
          globalFilter={globalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onGlobalFilterChange={setGlobalFilter}
          isLoading={isLoading}
          isPaginationLoading={isLoading && data.length > 0}
          totalRowCount={totalRows}
          className="w-full"
        />
      </div>
    );
  },
};
