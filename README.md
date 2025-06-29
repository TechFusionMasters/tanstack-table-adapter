# TableAdapter

A powerful, flexible, and feature-rich React table component built on top of [TanStack Table (React Table v8)](https://tanstack.com/table/v8). Designed for both client-side and server-side data, TableAdapter provides advanced features like pagination, sorting, filtering, row selection, column resizing, and more, with a simple and customizable API.

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

---

## Features

- **Client-side & server-side** pagination, sorting, filtering, and grouping
- **Row selection**, expansion, pinning, and grouping
- **Column resizing**, ordering, and visibility toggles
- **Custom renderers** for headers, footers, cells, pagination, and more
- **Loading states** and customizable loading components
- **Accessibility**: ARIA labels and keyboard navigation
- **TypeScript** support with strong generics
- **Export to CSV** utility
- **Tailwind CSS**-friendly by default

---

## Installation

```bash
npm install @TechFusionMasters/tanstack-table-adapter
```

Or with yarn:

```bash
yarn add @TechFusionMasters/tanstack-table-adapter
```

---

## Usage

```tsx
import React from "react";
import { TableAdapter } from "@TechFusionMasters/tanstack-table-adapter";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
];

const data = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 22 },
];

export default function App() {
  return (
    <TableAdapter
      data={data}
      columns={columns}
      enablePagination
      enableSorting
      className="w-full max-w-2xl"
    />
  );
}
```

---

## API

### `<TableAdapter />` Props

#### Core

- `data`: Array of row objects
- `columns`: Array of column definitions ([TanStack Table ColumnDef](https://tanstack.com/table/v8/docs/api/core/column-def))
- `totalRowCount?`: For server-side pagination
- `id?`, `debugTable?`, `getRowId?`

#### Features

- `enablePagination?`, `enableSorting?`, `enableMultiSort?`, `enableColumnFilters?`, `enableGlobalFilter?`, `enableColumnResizing?`, `enableRowSelection?`, `enableExpanding?`, `enablePinning?`, `enableStickyHeader?`, `enableGrouping?`

#### State & Control

- `pageSize?`, `pageIndex?`, `sorting?`, `columnFilters?`, `globalFilter?`, `columnVisibility?`, `rowSelection?`, `expanded?`, `columnOrder?`, `columnPinning?`, `grouping?`
- `onPaginationChange?`, `onSortingChange?`, `onColumnFiltersChange?`, `onGlobalFilterChange?`, `onColumnVisibilityChange?`, `onRowSelectionChange?`, `onExpandedChange?`, `onColumnOrderChange?`, `onColumnPinningChange?`, `onGroupingChange?`

#### Advanced

- `manualPagination?`, `manualSorting?`, `manualFiltering?`, `manualGrouping?`, `pageCount?`, `autoResetPageIndex?`, `globalFilterFn?`

#### Custom Renderers

- `renderTableHeader?`, `renderTableFooter?`, `renderPagination?`, `renderNoResults?`, `renderExpanded?`, `renderRowSubComponent?`, `renderGroupedCell?`, `renderSortIcon?`

#### Events

- `onRowClick?`, `onCellClick?`, `onExportData?`

#### Loading & Accessibility

- `isLoading?`, `isPaginationLoading?`, `loadingComponent?`, `paginationLoadingComponent?`, `showOverlayLoading?`
- `ariaLabel?`, `ariaLabelledBy?`, `ariaDescribedBy?`

#### Styling

- `className?`, `tableClassName?`, `headerClassName?`, `bodyClassName?`, `rowClassName?`, `cellClassName?`, `columnResizeMode?`, `pageSizeOptions?`, `enableSortingRemoval?`

---

## Utilities & Helpers

- `exportToCSV(data, columns, filename?)`: Export table data to CSV
- `fuzzyFilter`: Fuzzy text filter function for global/column filtering
- `GlobalFilterInput`: Ready-to-use global filter input component
- `ColumnVisibilityToggle`: UI for toggling column visibility

---

## Customization

- **Custom loading, pagination, and no-results components** can be provided via props
- **Full control** over table state (controlled/uncontrolled)
- **Composable** with your own UI and TanStack Table plugins

---

## License

MIT © 2025 TechFusionMasters
