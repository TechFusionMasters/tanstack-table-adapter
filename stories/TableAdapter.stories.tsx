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
import { ColumnDef } from "@tanstack/react-table";
import { fuzzyFilter } from "../src/utils";

/**
 * `TableAdapter` is a comprehensive wrapper around TanStack Table (React Table v8) that provides
 * a simplified API for implementing common table features like pagination, sorting, filtering,
 * and more while leveraging the powerful core functionality of TanStack Table.
 */
const meta: Meta<typeof TableAdapter<Person>> = {
  title: "TableAdapter/Basic",
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
    features: {
      control: "object",
      description:
        "Object containing feature flags to enable/disable table functionality",
    },
    styling: {
      control: "object",
      description:
        "Styling options for the table, including class names and inline styles",
    },
    loading: {
      control: "object",
      description: "Loading state configuration for different table operations",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * A basic example showing the default TableAdapter with minimal configuration.
 * This shows how easy it is to create a functional table with the adapter.
 * Includes add, update, and delete functionality.
 */
export const Basic: Story = {
  render: (args) => {
    const [data, setData] = React.useState([...smallDataSet]);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editForm, setEditForm] = React.useState<Partial<Person>>({});

    // Example: Add a new row with unique id and values
    const handleAddRow = () => {
      const newId = `person-${data.length + 1}`;
      setData([
        ...data,
        {
          id: newId,
          firstName: "New",
          lastName: "Person",
          age: 30,
          status: "active",
          visits: 0,
          progress: 0,
          email: `new.person${data.length + 1}@example.com`,
          createdAt: new Date(),
        },
      ]);
    };

    // Handle delete row
    const handleDeleteRow = (id: string) => {
      setData(data.filter((row) => row.id !== id));
    };

    // Handle start editing
    const handleStartEdit = (row: Person) => {
      setEditingId(row.id);
      setEditForm({
        firstName: row.firstName,
        lastName: row.lastName,
        age: row.age,
        status: row.status,
        email: row.email,
      });
    };

    // Handle save edit
    const handleSaveEdit = () => {
      if (editingId && editForm) {
        setData(
          data.map((row) =>
            row.id === editingId ? { ...row, ...editForm } : row
          )
        );
        setEditingId(null);
        setEditForm({});
      }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
      setEditingId(null);
      setEditForm({});
    };

    // Create action column
    const actionColumn: ColumnDef<Person, unknown> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id;

        if (isEditing) {
          return (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          );
        }

        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStartEdit(row.original)}
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteRow(row.original.id)}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        );
      },
    };

    // Create editable columns
    const editableColumns: ColumnDef<Person, unknown>[] = (
      columns as ColumnDef<Person, unknown>[]
    ).map((column) => {
      if (
        column.id === "firstName" ||
        column.id === "lastName" ||
        column.id === "age" ||
        column.id === "email"
      ) {
        return {
          ...column,
          cell: ({ row, getValue }) => {
            const isEditing = editingId === row.original.id;
            const value = getValue();

            if (isEditing) {
              const fieldValue = editForm[column.id as keyof Person];
              return (
                <input
                  type={column.id === "age" ? "number" : "text"}
                  value={
                    fieldValue !== undefined
                      ? String(fieldValue)
                      : String(value)
                  }
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      [column.id as keyof Person]:
                        column.id === "age"
                          ? parseInt(e.target.value) || 0
                          : e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              );
            }

            return value as React.ReactNode;
          },
        };
      }

      if (column.id === "status") {
        return {
          ...column,
          cell: ({ row, getValue }) => {
            const isEditing = editingId === row.original.id;
            const value = getValue();

            if (isEditing) {
              return (
                <select
                  value={(editForm.status || value) as string}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value as
                        | "active"
                        | "inactive"
                        | "pending",
                    }))
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              );
            }

            return (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value === "active"
                    ? "bg-green-100 text-green-800"
                    : value === "inactive"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {value as any}
              </span>
            );
          },
        };
      }

      return column as ColumnDef<Person, unknown>;
    });

    const finalColumns = [...editableColumns, actionColumn];

    return (
      <div>
        <button
          onClick={handleAddRow}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Row
        </button>
        <TableAdapter
          {...args}
          data={data}
          columns={finalColumns}
          totalRowCount={data.length}
        />
      </div>
    );
  },
  args: {
    data: smallDataSet,
    columns: columns as ColumnDef<Person>[],
    className: "w-full max-w-4xl",
    classNames: {
      table: "min-w-full divide-y divide-gray-200",
      thead: "bg-gray-50",
      theadCell:
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      tbody: "bg-white divide-y divide-gray-200",
      tbodyCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    },
    features: {
      pagination: true,
    },
    pageSize: 10,
    totalRowCount: smallDataSet.length,
  },
};

/**
 * Example showcasing the modern API using the feature flags approach.
 * This is the recommended way to configure the TableAdapter.
 */
export const ModernAPI: Story = {
  args: {
    data: smallDataSet,
    columns: columns as ColumnDef<Person>[],
    features: {
      pagination: true,
      sorting: true,
      multiSort: true,
      columnFilters: false,
      globalFilter: false,
      rowSelection: false,
    },
    styling: {
      className: "w-full max-w-4xl",
      classNames: {
        table: "min-w-full divide-y divide-gray-200",
        thead: "bg-gray-50",
        theadCell:
          "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        tbody: "bg-white divide-y divide-gray-200",
        tbodyCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
      },
      style: { maxHeight: "600px", overflow: "auto" },
    },
    pageSize: 6,
    totalRowCount: smallDataSet.length,
  },
};

/**
 * Example showing a table with custom styling.
 * This demonstrates how to override default styles with custom ones.
 */
export const CustomStyling: Story = {
  args: {
    data: smallDataSet,
    columns: columns as ColumnDef<Person>[],
    styling: {
      className: "w-full max-w-4xl shadow-lg rounded-lg overflow-hidden",
      classNames: {
        table: "min-w-full",
        thead: "bg-blue-600",
        theadRow: "border-b border-blue-500",
        theadCell:
          "px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider",
        tbody: "bg-white",
        tbodyRow: "hover:bg-blue-50 transition-colors duration-150 ease-in-out",
        tbodyCell:
          "px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200",
      },
    },
  },
};

export const WithPagination: Story = {
  args: {
    ...Basic.args,
    data: mediumDataSet,
    enablePagination: true,
    pageSize: 10,
    totalRowCount: mediumDataSet.length,
  },
};

export const WithSorting: Story = {
  args: {
    ...Basic.args,
    enableSorting: true,
    enableMultiSort: true,
    totalRowCount: smallDataSet.length,
  },
};

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
          totalRowCount={smallDataSet.length}
        />
      </div>
    );
  },
  args: {
    ...Basic.args,
    enableGlobalFilter: true,
    totalRowCount: smallDataSet.length,
  },
};

const selectionColumns: ColumnDef<Person, unknown>[] = [
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
    cell: ({ row }) => {
      return (
        <>
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </>
      );
    },
    size: 40,
  },
  ...(columns as ColumnDef<Person, unknown>[]),
];

export const WithRowSelection: Story = {
  render: (args) => {
    const [rowSelection, setRowSelection] = React.useState({});
    const selectedRows = React.useMemo(() => {
      if (!args.data) return [];
      return args.data.filter((row) => rowSelection[row.id]);
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
          columns={selectionColumns}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          features={{ ...args.features, rowSelection: true }}
          classNames={{
            ...args.classNames,
            tbodyRow: "transition-colors",
          }}
          totalRowCount={args.data.length}
        />
      </div>
    );
  },
  args: {
    data: smallDataSet,
    columns: selectionColumns,
    className: "w-full max-w-4xl",
    classNames: {
      table: "min-w-full divide-y divide-gray-200",
      thead: "bg-gray-50",
      theadCell:
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      tbody: "bg-white divide-y divide-gray-200",
      tbodyCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    },
    features: { pagination: true, rowSelection: true },
    pageSize: 10,
    totalRowCount: smallDataSet.length,
  },
};

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
          globalFilterFn={fuzzyFilter}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          totalRowCount={largeDataSet.length}
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
    features: {
      pagination: true,
      sorting: true,
      multiSort: true,
      globalFilter: true,
      rowSelection: true,
    },
    pageSize: 15,
    totalRowCount: largeDataSet.length,
  },
};
