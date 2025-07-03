import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter } from "../src";
import { columns, mediumDataSet, largeDataSet, Person } from "./mockData";
import type {
  SortingState,
  PaginationState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";

const meta: Meta<typeof TableAdapter<Person>> = {
  title: "TableAdapter/Advanced",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Advanced examples showcasing complex TableAdapter configurations and integrations.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * Comprehensive table with multiple features enabled.
 * Demonstrates a real-world configuration with pagination, sorting, filtering, and selection.
 */
export const ComprehensiveExample: Story = {
  render: (args) => {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState({});

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="px-4 py-2 border rounded-md w-64"
          />
          <span className="text-sm text-gray-500">
            {Object.keys(rowSelection).length} rows selected
          </span>
        </div>
        <TableAdapter
          {...args}
          state={{
            globalFilter: globalFilter,
            rowSelection: rowSelection,
          }}
          onStateChange={{
            onGlobalFilterChange: setGlobalFilter,
            onRowSelectionChange: setRowSelection,
          }}
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
      ...(columns as ColumnDef<Person, unknown>[]),
    ],
    features: {
      pagination: true,
      sorting: true,
      multiSort: true,
      globalFilter: true,
      rowSelection: true,
    },
    className: "w-full max-w-4xl",
    styling: {
      classNames: {
        table:
          "min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg overflow-hidden",
        thead: "bg-gray-50",
        theadRow: "border-b border-gray-200",
        theadCell:
          "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        tbody: "bg-white divide-y divide-gray-200",
        tbodyRow: "hover:bg-gray-50 transition-colors duration-150",
        tbodyCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
      },
    },
  },
};

/**
 * Server-side comprehensive example.
 * Demonstrates server-side pagination, sorting, and filtering working together.
 */
export const ServerSideExample: Story = {
  render: (args) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState<Person[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [totalRowCount, setTotalRowCount] = React.useState(0);
    const [globalFilter, setGlobalFilter] = React.useState("");

    // Simulate server-side operations
    const fetchData = React.useCallback(
      async <TData extends object>({
        pagination,
        sorting,
        filters,
        globalFilter,
      }: {
        pagination: PaginationState;
        sorting: SortingState;
        filters: ColumnFiltersState;
        globalFilter: string;
      }): Promise<{
        data: TData[];
        pageCount: number;
        totalRowCount: number;
      }> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const { pageIndex, pageSize } = pagination;

        // Clone the data to avoid mutating the original
        let processedData = [...args.data];

        // Apply global filter if present
        if (globalFilter) {
          const lowercaseFilter = globalFilter.toLowerCase();
          processedData = processedData.filter((item) => {
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

            processedData = processedData.filter((item) => {
              const itemValue = String(item[id]).toLowerCase();
              return itemValue.includes(String(value).toLowerCase());
            });
          });
        }

        // Apply sorting if present
        if (sorting && sorting.length > 0) {
          processedData.sort((a, b) => {
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
        }

        // Store the total filtered count before pagination
        const filteredCount = processedData.length;

        // Apply pagination
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        const paginatedData = processedData.slice(start, end) as TData[];

        setData(paginatedData as Person[]);
        setPageCount(Math.ceil(filteredCount / pageSize));
        setTotalRowCount(filteredCount);
        setIsLoading(false);

        return {
          data: paginatedData,
          pageCount: Math.ceil(filteredCount / pageSize),
          totalRowCount: filteredCount,
        };
      },
      [args.data]
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Server-side search..."
            className="px-4 py-2 border rounded-md w-64"
          />
          <span className="text-sm text-gray-500">
            {totalRowCount} total records
          </span>
        </div>
        <TableAdapter<Person>
          {...args}
          data={data}
          loading={{
            isLoading: isLoading,
            isPaginationLoading: isLoading,
            isSortingLoading: isLoading,
            isFilteringLoading: isLoading,
            showOverlayLoading: true,
          }}
          server={{
            manualPagination: true,
            manualSorting: true,
            manualFiltering: true,
            pageCount: pageCount,
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
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      pagination: true,
      sorting: true,
      multiSort: true,
      globalFilter: true,
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Row expanding example.
 * Demonstrates how to expand rows to show additional details.
 */
export const ExpandableRows: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      expanding: true,
    },
    render: {
      renderRowSubComponent: (row) => {
        const person = row.original;
        return (
          <div className="p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">
              {person.firstName} {person.lastName}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-md">{person.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-md">{person.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-md">{person.age} years old</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Visits</p>
                <p className="text-md">{person.visits}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Profile Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${person.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-600 mt-1">
                  {person.progress}%
                </p>
              </div>
            </div>
          </div>
        );
      },
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Column visibility toggle example.
 * Shows how to let users control which columns are displayed.
 */
export const ColumnVisibility: Story = {
  render: (args) => {
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const columnsWithId = (columns as ColumnDef<Person, unknown>[]).filter(
      (col) => col.id !== undefined
    );
    // Debug: log column ids
    console.log(
      "Column IDs:",
      columnsWithId.map((col) => col.id)
    );

    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Toggle Columns
          </h3>
          <div className="flex flex-wrap gap-2">
            {columnsWithId.map((column) => (
              <label
                key={column.id as string}
                className="inline-flex items-center"
              >
                <input
                  type="checkbox"
                  checked={columnVisibility[column.id as string] !== false}
                  onChange={() => {
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [column.id as string]:
                        prev[column.id as string] === false ? true : false,
                    }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                />
                <span className="text-sm text-gray-600">
                  {typeof column.header === "function"
                    ? column.id
                    : column.header}
                </span>
              </label>
            ))}
          </div>
        </div>
        <TableAdapter
          {...args}
          columns={columnsWithId}
          state={{
            columnVisibility: columnVisibility,
          }}
          onStateChange={{
            onColumnVisibilityChange: setColumnVisibility,
          }}
        />
      </div>
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    className: "w-full max-w-4xl",
  },
};

/**
 * Column resizing example.
 * Demonstrates how users can resize columns.
 */
export const ColumnResizing: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      columnResizing: true,
    },
    styling: {
      columnResizeMode: "onChange",
      classNames: {
        table: "min-w-full divide-y divide-gray-200 table-fixed",
        theadCell:
          "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative",
        tbodyCell:
          "px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden text-ellipsis",
      },
    },
    className: "w-full max-w-4xl",
  },
};

/**
 * Export functionality example.
 * Shows how to implement data export to CSV.
 */
export const ExportData: Story = {
  render: (args) => {
    const handleExport = (data) => {
      alert(`Exporting ${data.length} rows to CSV`);
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (args.data) {
                handleExport(args.data);
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Export to CSV
          </button>
        </div>
        <TableAdapter
          {...args}
          exportOptions={{
            formats: ["csv"],
            fileName: "table-data-export",
            includeHiddenColumns: false,
          }}
          events={{
            onExportData: handleExport,
          }}
        />
      </div>
    );
  },
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    className: "w-full max-w-4xl",
  },
};

/**
 * Custom table components example.
 * Shows how to override default rendering with custom components.
 */
export const CustomComponents: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person, unknown>[],
    features: {
      pagination: true,
      sorting: true,
    },
    render: {
      renderTableHeader: (table) => (
        <div className="bg-gray-100 p-4 mb-4 rounded-md flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Person Data</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {table.getFilteredRowModel().rows.length} records
            </span>
            <button
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              onClick={() => alert("Add New Record")}
            >
              Add New
            </button>
          </div>
        </div>
      ),
      renderNoResults: () => (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No results found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ),
      renderSortIcon: (direction) => {
        if (direction === false) {
          return <span className="ml-1 text-gray-400">⊿</span>;
        }
        return direction === "asc" ? (
          <span className="ml-1 text-indigo-600">▲</span>
        ) : (
          <span className="ml-1 text-indigo-600">▼</span>
        );
      },
    },
    className: "w-full max-w-4xl",
  },
};
