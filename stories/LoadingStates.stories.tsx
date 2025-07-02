import React, { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TableAdapter, TableWithLoadingStates } from "../src"; // Adjust import path as needed
import { columns, smallDataSet, mediumDataSet, Person } from "./mockData";
import { ColumnDef } from "@tanstack/react-table";

/**
 * This file demonstrates the different loading states available in the TableAdapter component.
 */
const meta: Meta<typeof TableAdapter<Person>> = {
  title: "Components/TableAdapter/Loading States",
  component: TableAdapter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TableAdapter provides multiple loading state options to improve user experience during data fetching.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Whether the table is in a loading state",
    },
    isPaginationLoading: {
      control: "boolean",
      description: "Whether the table pagination is in a loading state",
    },
    showOverlayLoading: {
      control: "boolean",
      description: "Whether to show a full-page loading overlay",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableAdapter<Person>>;

/**
 * A table with a simple loading state.
 */
export const BasicLoading: Story = {
  args: {
    data: [],
    columns: columns as ColumnDef<Person>[],
    isLoading: true,
    className: "w-full max-w-4xl",
  },
};

/**
 * A table with a loading state when changing pages.
 */
export const PaginationLoading: Story = {
  args: {
    data: mediumDataSet,
    columns: columns as ColumnDef<Person>[],
    className: "w-full max-w-4xl",
    enablePagination: true,
    isPaginationLoading: true,
  },
};

/**
 * A table with a full overlay loading state.
 */
export const OverlayLoading: Story = {
  args: {
    data: smallDataSet,
    columns: columns as ColumnDef<Person>[],
    className: "w-full max-w-4xl",
    isLoading: true,
    showOverlayLoading: true,
  },
};

/**
 * A table with custom loading components.
 */
export const CustomLoadingComponents: Story = {
  args: {
    data: smallDataSet,
    columns: columns as ColumnDef<Person>[],
    className: "w-full max-w-4xl",
    isLoading: true,
    loadingComponent: (
      <div className="flex flex-col items-center justify-center h-24">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-blue-400 rounded-full"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-blue-400 rounded w-36"></div>
            <div className="h-4 bg-blue-400 rounded w-24"></div>
          </div>
        </div>
      </div>
    ),
  },
};

/**
 * A table that demonstrates loading state transitions.
 */
export const LoadingStateTransitions: Story = {
  render: (args) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isPaginationLoading, setIsPaginationLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    // Simulate initial loading
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    // Simulate pagination loading when page changes
    const handlePageChange = (newPage: number) => {
      setIsPaginationLoading(true);
      setCurrentPage(newPage);

      setTimeout(() => {
        setIsPaginationLoading(false);
      }, 1000);
    };

    return (
      <div className="space-y-4 w-full max-w-4xl">
        <div className="p-4 bg-gray-50 rounded text-sm">
          <p>Initial loading state: {isLoading ? "Loading..." : "Completed"}</p>
          <p>
            Pagination loading state:{" "}
            {isPaginationLoading ? "Loading..." : "Idle"}
          </p>
          <p>Current page: {currentPage + 1}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setIsLoading(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Reload Data
            </button>
            <button
              onClick={() => handlePageChange((currentPage + 1) % 3)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Next Page
            </button>
          </div>
        </div>

        <TableAdapter
          {...args}
          data={isLoading ? [] : mediumDataSet}
          isLoading={isLoading}
          isPaginationLoading={isPaginationLoading}
          pageIndex={currentPage}
          onPaginationChange={(updater) => {
            const newState =
              typeof updater === "function"
                ? updater({ pageIndex: currentPage, pageSize: 10 })
                : updater;
            handlePageChange(newState.pageIndex);
          }}
        />
      </div>
    );
  },
  args: {
    columns: columns as ColumnDef<Person>[],
    className: "w-full max-w-4xl",
    enablePagination: true,
    pageSize: 10,
  },
};

/**
 * Using the TableWithLoadingStates wrapper component.
 */
export const TableWithLoadingStatesWrapper: Story = {
  render: (args) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isPaginationLoading, setIsPaginationLoading] = useState(false);

    // Simulate initial loading
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="space-y-4 w-full max-w-4xl">
        <div className="p-4 bg-gray-50 rounded text-sm">
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setIsLoading(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Reload Data
            </button>
            <button
              onClick={() => {
                setIsPaginationLoading(true);
                setTimeout(() => setIsPaginationLoading(false), 1500);
              }}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Simulate Page Change
            </button>
          </div>
        </div>

        <TableWithLoadingStates
          isInitialLoading={isLoading}
          isPaginationLoading={isPaginationLoading}
        >
          <TableAdapter {...args} data={isLoading ? [] : mediumDataSet} />
        </TableWithLoadingStates>
      </div>
    );
  },
  args: {
    columns: columns as ColumnDef<Person>[],
    className: "w-full max-w-4xl",
    enablePagination: true,
    pageSize: 10,
  },
};
