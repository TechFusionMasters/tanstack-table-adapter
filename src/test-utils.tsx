import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableAdapter } from "./index";
import type { TableAdapterProps } from "./types";

// For test utilities
/**
 * Creates a test table with default test data and columns
 *
 * This utility function is designed for unit testing components that use TableAdapter.
 * It provides helper methods to interact with and assert against the rendered table.
 *
 * @template TData - The type of data being displayed in the table
 *
 * @param props - Partial TableAdapter props to override defaults
 * @returns Object containing render result and helper functions
 *
 * @example
 * ```tsx
 * test('sorts table when clicking header', async () => {
 *   const { sortByColumn, getCellContent } = createTestTable();
 *
 *   await sortByColumn('Name');
 *   expect(getCellContent(0, 1)).toBe('Test 1');
 * });
 * ```
 */
export function createTestTable<TData extends object>(
  props: Partial<TableAdapterProps<TData>> = {}
) {
  // Default test data if none provided
  const defaultData = [
    { id: "1", name: "Test 1", value: 100 },
    { id: "2", name: "Test 2", value: 200 },
    { id: "3", name: "Test 3", value: 300 },
  ] as unknown as TData[];

  // Default columns if none provided
  const defaultColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "value", header: "Value" },
  ];

  // Render with defaults or overrides
  const renderResult = render(
    <TableAdapter
      data={props.data || defaultData}
      columns={props.columns || defaultColumns}
      {...props}
    />
  );

  // Helper functions for common testing scenarios
  return {
    ...renderResult,

    // Get table element
    getTable: () => screen.getByRole("table"),

    // Get all rows (excluding header)
    getRows: () => screen.getAllByRole("row").slice(1),

    // Get header cells
    getHeaderCells: () => screen.getAllByRole("columnheader"),

    // Get cells for a specific row
    getCellsForRow: (rowIndex: number) => {
      const rows = screen.getAllByRole("row");
      return within(rows[rowIndex + 1]).getAllByRole("cell");
    },

    // Get cell content
    getCellContent: (rowIndex: number, columnIndex: number) => {
      const cells = within(
        screen.getAllByRole("row")[rowIndex + 1]
      ).getAllByRole("cell");
      return cells[columnIndex].textContent;
    },

    // Sort by column
    sortByColumn: async (columnName: string) => {
      const headers = screen.getAllByRole("columnheader");
      const header = headers.find((h) => h.textContent?.includes(columnName));
      if (header) {
        await userEvent.click(header);
        return true;
      }
      return false;
    },

    // Change page
    goToNextPage: async () => {
      const nextButton = screen.getByText(">");
      await userEvent.click(nextButton);
    },

    goToPreviousPage: async () => {
      const prevButton = screen.getByText("<");
      await userEvent.click(prevButton);
    },

    goToPage: async (pageNumber: number) => {
      const lastButton = screen.getByText(">>");
      const firstButton = screen.getByText("<<");

      // First go to first page
      await userEvent.click(firstButton);

      // Then click next page until we reach desired page
      for (let i = 1; i < pageNumber; i++) {
        await userEvent.click(screen.getByText(">"));
      }
    },

    // Change page size
    changePageSize: async (size: number) => {
      const select = screen.getByRole("combobox");
      await userEvent.selectOptions(select, size.toString());
    },

    // Apply global filter
    applyGlobalFilter: async (filterText: string) => {
      const input = screen.getByPlaceholderText("Search...");
      await userEvent.clear(input);
      await userEvent.type(input, filterText);
    },

    // Apply column filter
    applyColumnFilter: async (columnName: string, filterValue: string) => {
      // This is a simplified implementation - you'll need to adapt based on your UI
      const filterInputs = screen.getAllByPlaceholderText("Filter...");
      const headers = screen.getAllByRole("columnheader");

      // Find the right filter input based on column index
      const columnIndex = headers.findIndex((h) =>
        h.textContent?.includes(columnName)
      );
      if (columnIndex >= 0 && columnIndex < filterInputs.length) {
        await userEvent.clear(filterInputs[columnIndex]);
        await userEvent.type(filterInputs[columnIndex], filterValue);
        return true;
      }
      return false;
    },

    // Get loading state
    isLoading: () => {
      const loadingElement = screen.queryByText("Loading data...");
      return !!loadingElement;
    },

    // Get pagination info
    getPaginationInfo: () => {
      const paginationText = screen.getByText(/Showing .* to .* of .* results/);
      const match = paginationText.textContent?.match(
        /Showing (\d+) to (\d+) of (\d+) results/
      );
      if (match) {
        return {
          from: parseInt(match[1]),
          to: parseInt(match[2]),
          total: parseInt(match[3]),
        };
      }
      return null;
    },

    // Check if a specific row is selected
    isRowSelected: (rowIndex: number) => {
      const rows = screen.getAllByRole("row");
      return rows[rowIndex + 1].classList.contains("selected"); // Assumes a 'selected' class
    },

    // Select a row (if row selection is enabled)
    selectRow: async (rowIndex: number) => {
      const rows = screen.getAllByRole("row");
      const checkboxes = within(rows[rowIndex + 1]).queryAllByRole("checkbox");
      if (checkboxes.length > 0) {
        await userEvent.click(checkboxes[0]);
        return true;
      }
      return false;
    },

    // Expand a row (if row expansion is enabled)
    expandRow: async (rowIndex: number) => {
      const rows = screen.getAllByRole("row");
      const expandButtons = within(rows[rowIndex + 1]).queryAllByRole("button");
      const expandButton = expandButtons.find(
        (b) => b.getAttribute("aria-label") === "Expand row"
      );
      if (expandButton) {
        await userEvent.click(expandButton);
        return true;
      }
      return false;
    },

    // Check if a row is expanded
    isRowExpanded: (rowIndex: number) => {
      const rows = screen.getAllByRole("row");
      const expandButtons = within(rows[rowIndex + 1]).queryAllByRole("button");
      const expandButton = expandButtons.find(
        (b) => b.getAttribute("aria-label") === "Expand row"
      );
      return expandButton?.getAttribute("aria-expanded") === "true";
    },

    // Toggle column visibility
    toggleColumn: async (columnName: string) => {
      // This assumes you have a column visibility toggle component
      const visibilityToggle = screen.getByText(columnName);
      await userEvent.click(visibilityToggle);
    },

    // Get column visibility state
    isColumnVisible: (columnName: string) => {
      const headers = screen.getAllByRole("columnheader");
      return headers.some((h) => h.textContent?.includes(columnName));
    },

    // Check if table has any data
    hasData: () => {
      return screen.getAllByRole("row").length > 1;
    },

    // Get the text content of a specific cell
    getCellText: (rowIndex: number, columnIndex: number) => {
      const rows = screen.getAllByRole("row");
      const cells = within(rows[rowIndex + 1]).getAllByRole("cell");
      return cells[columnIndex].textContent || "";
    },

    // Edit a cell (if cell editing is enabled)
    editCell: async (
      rowIndex: number,
      columnIndex: number,
      newValue: string
    ) => {
      const rows = screen.getAllByRole("row");
      const cells = within(rows[rowIndex + 1]).getAllByRole("cell");
      const cell = cells[columnIndex];

      // Click on cell to enter edit mode
      await userEvent.click(cell);

      // Find input field in edit mode
      const input = within(cell).getByRole("textbox");

      // Update input value
      await userEvent.clear(input);
      await userEvent.type(input, newValue);

      // Press Enter to confirm
      await userEvent.keyboard("{Enter}");
    },

    // Submit form (if form mode is enabled)
    submitForm: async () => {
      const submitButton = screen.getByRole("button", { name: /save|submit/i });
      await userEvent.click(submitButton);
    },

    // Reset form (if form mode is enabled)
    resetForm: async () => {
      const resetButton = screen.getByRole("button", { name: /reset|cancel/i });
      await userEvent.click(resetButton);
    },

    // Get validation errors (if form validation is enabled)
    getValidationErrors: () => {
      return screen.queryAllByText(/is required|invalid/i);
    },

    // Check if a specific cell has validation error
    hasCellValidationError: (rowIndex: number, columnIndex: number) => {
      const rows = screen.getAllByRole("row");
      const cells = within(rows[rowIndex + 1]).getAllByRole("cell");
      const cell = cells[columnIndex];
      return within(cell).queryAllByText(/is required|invalid/i).length > 0;
    },

    // Debug utility to print table structure
    debug: () => {
      console.log("Table Structure:");
      console.log(`Headers (${screen.getAllByRole("columnheader").length}):`);
      screen.getAllByRole("columnheader").forEach((header, i) => {
        console.log(`  ${i}: ${header.textContent}`);
      });

      console.log(`Rows (${screen.getAllByRole("row").length - 1}):`);
      screen
        .getAllByRole("row")
        .slice(1)
        .forEach((row, i) => {
          const cells = within(row).getAllByRole("cell");
          console.log(`  Row ${i}:`);
          cells.forEach((cell, j) => {
            console.log(`    Cell ${j}: ${cell.textContent}`);
          });
        });
    },
  };
}

/**
 * Example usage:
 *
 * test('sorts table when clicking header', async () => {
 *   const { sortByColumn, getCellContent } = createTestTable();
 *
 *   // Sort by name column
 *   await sortByColumn('Name');
 *
 *   // Check first row has expected content after sorting
 *   expect(getCellContent(0, 1)).toBe('Test 1');
 * });
 */
