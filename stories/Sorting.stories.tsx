import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src";
import { columns, mediumDataSet } from "./mockData";
import { Person } from "./mockData";
import { ColumnDef } from "@tanstack/react-table";

const meta: Meta<typeof TableAdapter<Person>> = {
  title: "TableAdapter/Sorting",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Examples showcasing the sorting capabilities of TableAdapter.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * Basic sorting example with clickable headers.
 * Users can click on column headers to sort by that column.
 */
export const BasicSorting: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      sorting: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Multi-column sorting example.
 * Users can sort by multiple columns by holding Shift while clicking column headers.
 */
export const MultiColumnSorting: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hold Shift while clicking column headers to add secondary sort criteria.",
      },
    },
  },
};

/**
 * Example with initial sorted state.
 * Table is pre-sorted when it first renders.
 */
export const InitialSortState: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      sorting: true,
      multiSort: true,
    },
    state: {
      sorting: [
        { id: "lastName", desc: false },
        { id: "firstName", desc: false },
      ],
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Example with custom sort icons.
 * Demonstrates how to replace the default sort indicators with custom icons.
 */
export const CustomSortIcons: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      sorting: true,
    },
    render: {
      renderSortIcon: (direction) => {
        if (direction === false)
          return <span className="ml-1 text-gray-400">↕</span>;
        return direction === "asc" ? (
          <span className="ml-1 text-blue-600">↑</span>
        ) : (
          <span className="ml-1 text-blue-600">↓</span>
        );
      },
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * Server-side sorting example.
 * Demonstrates how to integrate with backend API for sorting.
 */
export const ServerSideSorting: Story = {
  render: (args) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState(args.data);
    const [totalRowCount, setTotalRowCount] = React.useState(args.data.length);

    // Simulate server-side sorting
    const fetchData = React.useCallback(
      async <TData extends object>({
        pagination,
        sorting,
        filters,
        globalFilter,
      }: {
        pagination?: any;
        sorting: any;
        filters?: any;
        globalFilter?: any;
      }): Promise<{
        data: TData[];
        pageCount: number;
        totalRowCount: number;
      }> => {
        if (!sorting || sorting.length === 0) {
          setTotalRowCount(args.data.length);
          return {
            data: args.data as TData[],
            pageCount: 1,
            totalRowCount: args.data.length,
          };
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Sort data based on sorting state
        const sortedData = [...args.data].sort((a, b) => {
          for (const sort of sorting) {
            const { id, desc } = sort;
            if (a[id] < b[id]) {
              return desc ? 1 : -1;
            }
            if (a[id] > b[id]) {
              return desc ? -1 : 1;
            }
          }
          return 0;
        });

        setData(sortedData as Person[]);
        setIsLoading(false);
        setTotalRowCount(sortedData.length);

        return {
          data: sortedData as TData[],
          pageCount: 1,
          totalRowCount: sortedData.length,
        };
      },
      [args.data]
    );

    return (
      <TableAdapter
        {...args}
        data={data}
        loading={{
          isLoading: isLoading,
          isSortingLoading: isLoading,
        }}
        server={{
          manualSorting: true,
          fetchData: fetchData,
        }}
        totalRowCount={totalRowCount}
      />
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Example with controlled sorting state.
 * Shows how to manage sorting externally with React state.
 */
export const ControlledSorting: Story = {
  render: (args) => {
    const [sorting, setSorting] = React.useState([
      { id: "lastName", desc: false },
    ]);

    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">
            Current Sort State:
          </h3>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(sorting, null, 2)}
          </pre>
        </div>
        <TableAdapter
          {...args}
          state={{
            sorting: sorting,
          }}
          onStateChange={{
            onSortingChange: setSorting,
          }}
        />
      </div>
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
  },
};
