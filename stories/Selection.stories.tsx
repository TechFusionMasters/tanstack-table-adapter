import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src";
import { columns, mediumDataSet, Person } from "./mockData";
import { ColumnDef } from "@tanstack/react-table";

const meta: Meta<typeof TableAdapter<Person>> = {
  title: "TableAdapter/Selection",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Examples showcasing the row selection capabilities of TableAdapter.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * Basic row selection example.
 * Demonstrates how to enable checkboxes for selecting rows.
 */
export const BasicRowSelection: Story = {
  args: {
    data: mediumDataSet,
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
      ...(columns as ColumnDef<Person>[]),
    ],
    features: {
      rowSelection: true,
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Controlled row selection example.
 * Shows how to manage selection state externally with React state.
 */
export const ControlledSelection: Story = {
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
      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700">
            Selected Rows: {Object.keys(rowSelection).length}
          </h3>
          <pre className="mt-2 text-xs overflow-auto max-h-40">
            {JSON.stringify(selectedRows, null, 2)}
          </pre>
        </div>
        <TableAdapter
          {...args}
          state={{
            rowSelection: rowSelection,
          }}
          onStateChange={{
            onRowSelectionChange: setRowSelection,
          }}
        />
        {Object.keys(rowSelection).length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => setRowSelection({})}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    );
  },
  args: {
    data: mediumDataSet,
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
      ...(columns as ColumnDef<Person>[]),
    ],
    features: {
      rowSelection: true,
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Row selection with row click example.
 * Shows how to select rows by clicking anywhere on the row.
 */
export const SelectionWithRowClick: Story = {
  render: (args) => {
    const [rowSelection, setRowSelection] = React.useState({});

    const handleRowClick = (row) => {
      setRowSelection((prev) => {
        const newSelection = { ...prev };
        const isSelected = !!newSelection[row.id];
        if (isSelected) {
          delete newSelection[row.id];
        } else {
          newSelection[row.id] = true;
        }
        return newSelection;
      });
    };

    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-700">
            Click on any row to select/deselect it
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Selected: {Object.keys(rowSelection).length} rows
          </p>
        </div>
        <TableAdapter
          {...args}
          state={{
            rowSelection: rowSelection,
          }}
          onStateChange={{
            onRowSelectionChange: setRowSelection,
          }}
          events={{
            onRowClick: handleRowClick,
          }}
          styling={{
            rowStyle: (row) => ({
              cursor: "pointer",
              backgroundColor: row.getIsSelected() ? "#EFF6FF" : undefined,
              fontWeight: row.getIsSelected() ? "bold" : undefined,
            }),
          }}
        />
      </div>
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      rowSelection: true,
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Row selection with bulk actions example.
 * Shows how to implement actions that apply to selected rows.
 */
export const SelectionWithBulkActions: Story = {
  render: (args) => {
    const [rowSelection, setRowSelection] = React.useState({});
    const [actionLog, setActionLog] = React.useState<string[]>([]);

    // Get selected rows' data
    const selectedRows = React.useMemo(() => {
      if (!args.data) return [];
      return Object.keys(rowSelection)
        .map((rowId) => args.data[parseInt(rowId, 10)])
        .filter(Boolean);
    }, [rowSelection, args.data]);

    const handleBulkAction = (action) => {
      if (selectedRows.length === 0) {
        alert("Please select at least one row");
        return;
      }

      setActionLog((prev) => [
        `${action} performed on ${selectedRows.length} rows: ${selectedRows
          .map((row) => row.id)
          .join(", ")}`,
        ...prev,
      ]);
    };

    return (
      <div className="space-y-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Bulk Actions
              </h3>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {Object.keys(rowSelection).length} selected
              </span>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() => handleBulkAction("Export")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export
              </button>
              <button
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() => handleBulkAction("Delete")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
              <button
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() => handleBulkAction("Archive")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Archive
              </button>
              <button
                onClick={() => setRowSelection({})}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>

        <TableAdapter
          {...args}
          state={{
            rowSelection: rowSelection,
          }}
          onStateChange={{
            onRowSelectionChange: setRowSelection,
          }}
        />

        {actionLog.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Action Log</h3>
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2 text-sm text-gray-600">
                {actionLog.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  },
  args: {
    data: mediumDataSet,
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
      ...(columns as ColumnDef<Person>[]),
    ],
    features: {
      rowSelection: true,
    },
    className: "w-full max-w-4xl",
  },
};
