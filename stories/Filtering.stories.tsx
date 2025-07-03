import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src";
import { columns, mediumDataSet, largeDataSet } from "./mockData";
import { Person } from "./mockData";
import { fuzzyFilter } from "../src/utils";
import { ColumnDef } from "@tanstack/react-table";

const meta: Meta<typeof TableAdapter<Person>> = {
  title: "In Progress/TableAdapter/Filtering",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Examples showcasing the filtering capabilities of TableAdapter.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * Global filtering example.
 * Demonstrates how to add a search box that filters across all columns.
 */
export const GlobalFilter: Story = {
  render: (args) => {
    const [globalFilter, setGlobalFilter] = React.useState("");

    return (
      <div className="space-y-4">
        <div className="flex">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <TableAdapter
          {...args}
          state={{
            globalFilter: globalFilter,
          }}
          onStateChange={{
            onGlobalFilterChange: setGlobalFilter,
          }}
          totalRowCount={mediumDataSet.length}
        />
      </div>
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      globalFilter: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Column-specific filtering example.
 * Shows how to add filters to individual columns.
 */
export const ColumnFilters: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      columnFilters: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Advanced filtering with custom filter functions.
 * Demonstrates how to implement custom filtering logic.
 */
export const CustomFilterFunctions: Story = {
  render: (args) => {
    const [globalFilter, setGlobalFilter] = React.useState("");

    return (
      <div className="space-y-4">
        <div className="flex">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search with fuzzy matching..."
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <TableAdapter
          {...args}
          state={{
            globalFilter: globalFilter,
          }}
          onStateChange={{
            onGlobalFilterChange: setGlobalFilter,
          }}
          globalFilterFn={fuzzyFilter}
          totalRowCount={mediumDataSet.length}
        />
      </div>
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      globalFilter: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Server-side filtering example.
 * Shows how to handle filtering on the server.
 */
export const ServerSideFiltering: Story = {
  render: (args) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState(args.data);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [totalRowCount, setTotalRowCount] = React.useState(args.data.length);

    // Simulate server-side filtering
    const fetchData = React.useCallback(
      async <TData extends object>({
        pagination,
        sorting,
        filters,
        globalFilter,
      }: {
        pagination?: any;
        sorting?: any;
        filters?: any;
        globalFilter?: any;
      }): Promise<{
        data: TData[];
        pageCount: number;
        totalRowCount: number;
      }> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filteredData = [...args.data];

        // Apply global filter if present
        if (globalFilter) {
          const lowercaseFilter = globalFilter.toLowerCase();
          filteredData = filteredData.filter((item) => {
            return Object.values(item).some((value) => {
              if (value == null) return false;
              return String(value).toLowerCase().includes(lowercaseFilter);
            });
          });
        }

        // Apply column filters if present
        if (filters && filters.length > 0) {
          filters.forEach((filter) => {
            const { id, value } = filter;
            if (!value) return;

            filteredData = filteredData.filter((item) => {
              const itemValue = String(item[id]).toLowerCase();
              return itemValue.includes(String(value).toLowerCase());
            });
          });
        }

        setData(filteredData as Person[]);
        setIsLoading(false);
        setTotalRowCount(filteredData.length);

        return {
          data: filteredData as TData[],
          pageCount: 1,
          totalRowCount: filteredData.length,
        };
      },
      [args.data]
    );

    return (
      <div className="space-y-4">
        <div className="flex">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Server-side search..."
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <TableAdapter
          {...args}
          data={data}
          loading={{
            isLoading: isLoading,
            isFilteringLoading: isLoading,
          }}
          server={{
            manualFiltering: true,
            fetchData: fetchData,
          }}
          state={{
            globalFilter: globalFilter,
          }}
          onStateChange={{
            onGlobalFilterChange: setGlobalFilter,
          }}
          totalRowCount={totalRowCount}
        />
      </div>
    );
  },
  args: {
    data: largeDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      globalFilter: true,
      columnFilters: true,
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Combined filtering and pagination example.
 * Shows how filtering and pagination work together.
 */
export const FilteringWithPagination: Story = {
  render: (args) => {
    const [globalFilter, setGlobalFilter] = React.useState("");

    return (
      <div className="space-y-4">
        <div className="flex">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <TableAdapter
          {...args}
          state={{
            globalFilter: globalFilter,
          }}
          onStateChange={{
            onGlobalFilterChange: setGlobalFilter,
          }}
          totalRowCount={largeDataSet.length}
        />
      </div>
    );
  },
  args: {
    data: largeDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      pagination: true,
      globalFilter: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: largeDataSet.length,
  },
};
