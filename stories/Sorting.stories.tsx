import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src";
import { columns, mediumDataSet } from "./mockData";
import { Person } from "./mockData";
import { ColumnDef, SortingState } from "@tanstack/react-table";

const meta: Meta<typeof TableAdapter<Person>> = {
  title: "In Progress/TableAdapter/Sorting",
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
  render: (args) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Local columns for multi-sort test
    const multiSortColumns: ColumnDef<Person, unknown>[] = [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: false,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        enableSorting: true,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        enableSorting: true,
      },
      {
        accessorKey: "age",
        header: "Age",
        enableSorting: true,
      },
    ];

    // Local data for multi-sort test
    const multiSortData: Person[] = [
      {
        id: "1",
        firstName: "Alice",
        lastName: "Smith",
        age: 30,
        status: "active",
        visits: 0,
        progress: 0,
        email: "alice.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "2",
        firstName: "Bob",
        lastName: "Smith",
        age: 25,
        status: "inactive",
        visits: 0,
        progress: 0,
        email: "bob.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "3",
        firstName: "Alice",
        lastName: "Jones",
        age: 28,
        status: "pending",
        visits: 0,
        progress: 0,
        email: "alice.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "4",
        firstName: "Bob",
        lastName: "Jones",
        age: 35,
        status: "active",
        visits: 0,
        progress: 0,
        email: "bob.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "5",
        firstName: "Charlie",
        lastName: "Smith",
        age: 22,
        status: "active",
        visits: 0,
        progress: 0,
        email: "charlie.smith@example.com",
        createdAt: new Date(),
      },
    ];

    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <strong>Multi-Column Sorting Test:</strong>
          </p>
          <ul className="text-xs text-green-700 mt-2 list-disc list-inside">
            <li>Click on "First Name" to sort by first name</li>
            <li>
              Hold{" "}
              <kbd className="px-1 py-0.5 bg-green-100 rounded text-xs">
                Shift
              </kbd>{" "}
              and click on "Last Name" to add secondary sort
            </li>
            <li>
              You should see both columns sorted with numbers (1, 2) indicating
              sort priority
            </li>
          </ul>
          <div className="mt-2 p-2 bg-white rounded border">
            <p className="text-xs font-mono">
              Current Sort: {JSON.stringify(sorting)}
            </p>
          </div>
        </div>
        <TableAdapter
          {...args}
          data={multiSortData}
          columns={multiSortColumns}
          state={{ sorting }}
          onStateChange={{ onSortingChange: setSorting }}
          debugTable={true}
          enableMultiSort={true}
          isMultiSortEvent={(e) => (e as any).shiftKey}
        />
      </div>
    );
  },
  args: {
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: 5,
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

/**
 * Example with disabled multi-sorting for the entire table.
 * Users can only sort by one column at a time.
 */
export const DisabledMultiSorting: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      sorting: true,
      multiSort: false, // Disable multi-sorting for the entire table
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-sorting is disabled for the entire table. Users can only sort by one column at a time.",
      },
    },
  },
};

/**
 * Example with disabled multi-sorting for specific columns.
 * Some columns can participate in multi-sort, others cannot.
 */
export const DisabledMultiSortingForSpecificColumns: Story = {
  render: (args) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Local columns: disable multi-sort for status and progress
    const columns: ColumnDef<Person, unknown>[] = [
      { accessorKey: "id", header: "ID", enableSorting: false },
      { accessorKey: "firstName", header: "First Name", enableSorting: true },
      { accessorKey: "lastName", header: "Last Name", enableSorting: true },
      { accessorKey: "age", header: "Age", enableSorting: true },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        enableMultiSort: false,
      },
      {
        accessorKey: "progress",
        header: "Progress",
        enableSorting: true,
        enableMultiSort: false,
      },
    ];

    // Local data for clarity
    const data: Person[] = [
      {
        id: "1",
        firstName: "Alice",
        lastName: "Smith",
        age: 30,
        status: "active",
        visits: 0,
        progress: 10,
        email: "alice.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "2",
        firstName: "Bob",
        lastName: "Smith",
        age: 25,
        status: "inactive",
        visits: 0,
        progress: 20,
        email: "bob.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "3",
        firstName: "Alice",
        lastName: "Jones",
        age: 28,
        status: "pending",
        visits: 0,
        progress: 30,
        email: "alice.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "4",
        firstName: "Bob",
        lastName: "Jones",
        age: 35,
        status: "active",
        visits: 0,
        progress: 40,
        email: "bob.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "5",
        firstName: "Charlie",
        lastName: "Smith",
        age: 22,
        status: "active",
        visits: 0,
        progress: 50,
        email: "charlie.smith@example.com",
        createdAt: new Date(),
      },
    ];

    return (
      <div className="space-y-4">
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
          <p className="text-sm text-orange-800">
            <strong>
              Multi-sorting is disabled for specific columns (status and
              progress).
            </strong>{" "}
            These columns will replace all existing sorting when clicked, while
            others can be multi-sorted with{" "}
            <kbd className="px-1 py-0.5 bg-orange-100 rounded text-xs">
              Shift
            </kbd>
            +Click.
          </p>
          <div className="mt-2 p-2 bg-white rounded border">
            <p className="text-xs font-mono">
              Current Sort: {JSON.stringify(sorting)}
            </p>
          </div>
        </div>
        <TableAdapter
          {...args}
          data={data}
          columns={columns}
          state={{ sorting }}
          onStateChange={{ onSortingChange: setSorting }}
          isMultiSortEvent={(e) => (e as any).shiftKey}
        />
      </div>
    );
  },
  args: {
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-sorting is disabled for specific columns (status and progress). These columns will replace all existing sorting when clicked, while others can be multi-sorted with Shift+Click.",
      },
    },
  },
};

/**
 * Example with customized multi-sorting trigger.
 * Uses Ctrl key instead of Shift key for multi-sorting.
 */
export const CustomMultiSortingTrigger: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Custom Multi-Sorting:</strong> Hold{" "}
            <kbd className="px-2 py-1 bg-blue-100 rounded text-xs">Ctrl</kbd>{" "}
            key while clicking column headers to add multiple sort criteria.
          </p>
        </div>
        <TableAdapter
          {...args}
          isMultiSortEvent={(e) => (e as any).ctrlKey} // Use Ctrl key instead of Shift
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-sorting is triggered by holding the Ctrl key instead of the default Shift key.",
      },
    },
  },
};

/**
 * Example with multi-sorting limit.
 * Only allows up to 3 columns to be sorted at once.
 */
export const MultiSortingLimit: Story = {
  render: (args) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Local columns for multi-sort limit test
    const multiSortColumns: ColumnDef<Person, unknown>[] = [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: false,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        enableSorting: true,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        enableSorting: true,
      },
      {
        accessorKey: "age",
        header: "Age",
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
      },
    ];

    // Local data for multi-sort limit test
    const multiSortData: Person[] = [
      {
        id: "1",
        firstName: "Alice",
        lastName: "Smith",
        age: 30,
        status: "active",
        visits: 0,
        progress: 0,
        email: "alice.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "2",
        firstName: "Bob",
        lastName: "Smith",
        age: 25,
        status: "inactive",
        visits: 0,
        progress: 0,
        email: "bob.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "3",
        firstName: "Alice",
        lastName: "Jones",
        age: 28,
        status: "pending",
        visits: 0,
        progress: 0,
        email: "alice.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "4",
        firstName: "Bob",
        lastName: "Jones",
        age: 35,
        status: "active",
        visits: 0,
        progress: 0,
        email: "bob.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "5",
        firstName: "Charlie",
        lastName: "Smith",
        age: 22,
        status: "active",
        visits: 0,
        progress: 0,
        email: "charlie.smith@example.com",
        createdAt: new Date(),
      },
    ];

    return (
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Multi-Sorting Limit:</strong> Maximum of 3 columns can be
            sorted simultaneously.
          </p>
        </div>
        <TableAdapter
          {...args}
          data={multiSortData}
          columns={multiSortColumns}
          state={{ sorting }}
          onStateChange={{ onSortingChange: setSorting }}
          maxMultiSortColCount={3}
          isMultiSortEvent={(e) => (e as any).shiftKey}
        />
      </div>
    );
  },
  args: {
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-sorting is limited to a maximum of 3 columns. Additional sort attempts will be ignored.",
      },
    },
  },
};

/**
 * Example with disabled multi-sorting removal.
 * Once columns are sorted, they cannot be removed from the sort order.
 */
export const DisabledMultiSortingRemoval: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Multi-Sorting Removal Disabled:</strong> Once columns are
            sorted, they cannot be removed from the sort order.
          </p>
        </div>
        <TableAdapter
          {...args}
          enableMultiRemove={false} // Disable multi-sorting removal
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-sorting removal is disabled. Once columns are sorted, they remain in the sort order and cannot be removed.",
      },
    },
  },
};

/**
 * Example with both custom trigger and limit.
 * Uses Ctrl key for multi-sorting with a limit of 2 columns.
 */
export const CustomTriggerWithLimit: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: mediumDataSet.length,
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
          <p className="text-sm text-purple-800">
            <strong>Custom Trigger + Limit:</strong> Hold{" "}
            <kbd className="px-2 py-1 bg-purple-100 rounded text-xs">Ctrl</kbd>{" "}
            key for multi-sorting, maximum 2 columns.
          </p>
        </div>
        <TableAdapter
          {...args}
          isMultiSortEvent={(e) => (e as any).ctrlKey} // Use Ctrl key
          maxMultiSortColCount={2} // Limit to 2 columns
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combines custom multi-sorting trigger (Ctrl key) with a limit of 2 columns maximum.",
      },
    },
  },
};

/**
 * Always multi-sort example.
 * Every click triggers multi-sorting (no modifier key required).
 */
export const AlwaysMultiSort: Story = {
  render: (args) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Local columns for always multi-sort test
    const multiSortColumns: ColumnDef<Person, unknown>[] = [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: false,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        enableSorting: true,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        enableSorting: true,
      },
      {
        accessorKey: "age",
        header: "Age",
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
      },
    ];

    // Local data for always multi-sort test
    const multiSortData: Person[] = [
      {
        id: "1",
        firstName: "Alice",
        lastName: "Smith",
        age: 30,
        status: "active",
        visits: 0,
        progress: 0,
        email: "alice.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "2",
        firstName: "Bob",
        lastName: "Smith",
        age: 25,
        status: "inactive",
        visits: 0,
        progress: 0,
        email: "bob.smith@example.com",
        createdAt: new Date(),
      },
      {
        id: "3",
        firstName: "Alice",
        lastName: "Jones",
        age: 28,
        status: "pending",
        visits: 0,
        progress: 0,
        email: "alice.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "4",
        firstName: "Bob",
        lastName: "Jones",
        age: 35,
        status: "active",
        visits: 0,
        progress: 0,
        email: "bob.jones@example.com",
        createdAt: new Date(),
      },
      {
        id: "5",
        firstName: "Charlie",
        lastName: "Smith",
        age: 22,
        status: "active",
        visits: 0,
        progress: 0,
        email: "charlie.smith@example.com",
        createdAt: new Date(),
      },
    ];

    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Always Multi-Sort:</strong> Every click triggers
            multi-sorting (no modifier key required).
          </p>
        </div>
        <TableAdapter
          {...args}
          data={multiSortData}
          columns={multiSortColumns}
          state={{ sorting }}
          onStateChange={{ onSortingChange: setSorting }}
          isMultiSortEvent={(e) => true}
        />
      </div>
    );
  },
  args: {
    features: {
      sorting: true,
      multiSort: true,
    },
    className: "w-full max-w-4xl",
    totalRowCount: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "Every click triggers multi-sorting (no modifier key required).",
      },
    },
  },
};
