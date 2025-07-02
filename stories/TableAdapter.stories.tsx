import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src";
import {
  columns,
  smallDataSet,
  mediumDataSet,
  largeDataSet,
  Person,
} from "./mockData";
import { fuzzyFilter } from "../src/utils";

/**
 * The TableAdapter component provides a feature-rich wrapper around TanStack Table (React Table v8).
 * It simplifies the implementation of common table features like pagination, sorting, and filtering.
 */
const meta: Meta<typeof TableAdapter<Person>> = {
  title: "Components/TableAdapter",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable table component built on top of TanStack Table with built-in features for pagination, sorting, filtering, and more.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "The data to be displayed in the table",
    },
    columns: {
      control: "object",
      description: "Column definitions for the table",
    },
    className: {
      control: "text",
      description: "CSS class for the wrapper div",
    },
    enablePagination: {
      control: "boolean",
      description: "Whether to enable pagination",
    },
    enableSorting: {
      control: "boolean",
      description: "Whether to enable sorting",
    },
    enableMultiSort: {
      control: "boolean",
      description: "Whether to enable multi-column sorting",
    },
    enableGlobalFilter: {
      control: "boolean",
      description: "Whether to enable global filtering",
    },
    pageSize: {
      control: { type: "number", min: 5, max: 100, step: 5 },
      description: "Number of rows per page",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the table is in a loading state",
    },
    enableRowSelection: {
      control: "boolean",
      description: "Whether to enable row selection",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * A basic table with a small dataset.
 */
export const Basic: Story = {
  args: {
    data: smallDataSet,
    columns: columns as any,
    className: "w-full max-w-4xl",
    classNames: {
      table: "min-w-full divide-y divide-gray-200",
    },
  },
};

/**
 * A table with pagination enabled.
 */
export const WithPagination: Story = {
  args: {
    ...Basic.args,
    data: mediumDataSet,
    enablePagination: true,
    pageSize: 10,
    totalRowCount: mediumDataSet.length,
  },
};

/**
 * A table with sorting enabled.
 */
export const WithSorting: Story = {
  args: {
    ...Basic.args,
    enableSorting: true,
    enableMultiSort: true,
  },
};

/**
 * A table with global filtering enabled.
 */
export const WithGlobalFilter: Story = {
  render: (args) => {
    const [globalFilter, setGlobalFilter] = React.useState("");

    return (
      <div className="space-y-4 w-full max-w-4xl">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="px-4 py-2 border rounded w-full"
        />
        <TableAdapter
          {...args}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          globalFilterFn={fuzzyFilter}
        />
      </div>
    );
  },
  args: {
    ...Basic.args,
    enableGlobalFilter: true,
  },
};

/**
 * A table with row selection enabled.
 */
export const WithRowSelection: Story = {
  render: (args) => {
    const [rowSelection, setRowSelection] = React.useState({});
    // Get selected rows' data
    const selectedRows = React.useMemo(() => {
      if (!args.data) return [];
      return Object.keys(rowSelection)
        .map((rowId) => args.data[parseInt(rowId, 10)])
        .filter(Boolean);
    }, [rowSelection, args.data]);

    return (
      <div className="space-y-4 w-full max-w-4xl">
        <style>{`.selected { background-color: #dbeafe !important; }`}</style>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-700">
            Selected rows: {Object.keys(rowSelection).length}
          </p>
          <pre className="text-xs bg-gray-100 rounded p-2 mt-2 overflow-x-auto">
            {JSON.stringify(selectedRows, null, 2)}
          </pre>
        </div>
        <TableAdapter
          {...args}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          classNames={{
            ...args.classNames,
            tbodyRow: "transition-colors",
          }}
        />
      </div>
    );
  },
  args: {
    ...Basic.args,
    enableRowSelection: true,
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        ),
        size: 40,
      },
      ...(columns as any),
    ],
  },
};

/**
 * A table with a large dataset, pagination, sorting, and filtering.
 */
export const CompleteExample: Story = {
  render: (args) => {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState({});

    return (
      <div className="space-y-4 w-full max-w-5xl">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="px-4 py-2 border rounded w-full max-w-md"
          />
          <div className="text-sm text-gray-700">
            Selected: {Object.keys(rowSelection).length}
          </div>
        </div>
        <TableAdapter
          {...args}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>
    );
  },
  args: {
    data: largeDataSet,
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        ),
        size: 40,
      },
      ...(columns as any),
    ],
    className: "w-full",
    enablePagination: true,
    enableSorting: true,
    enableMultiSort: true,
    enableGlobalFilter: true,
    enableRowSelection: true,
    pageSize: 15,
    totalRowCount: largeDataSet.length,
  },
};
