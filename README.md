# TableAdapter

TableAdapter is a reusable, opinionated helper/wrapper for [TanStack Table (React Table v8)](https://tanstack.com/table/v8). It much easier and faster to build advanced, production-ready tables with TanStack Table. TableAdapter provides sensible defaults, built-in UI helpers, and developer experience improvements—so you can focus on your app, not table boilerplate.

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

---

## Demo

- **Live Demo:** [https://techfusionmasters.github.io/tanstack-table-adapter](https://techfusionmasters.github.io/tanstack-table-adapter)
- **API Documentation:** [https://techfusionmasters.github.io/tanstack-table-adapter/api/index.html](https://techfusionmasters.github.io/tanstack-table-adapter/api/index.html)

---

## Unique Features of TableAdapter

- **Unified, opinionated API** for rapid table setup with sensible defaults
- **Built-in loading states**: initial, overlay, and pagination loading with customizable components
- **Server/client mode switching**: seamless support for both client-side and server-side data, including pagination, sorting, and filtering
- **Customizable renderers** for table header, footer, pagination, no-results, expanded rows, and more
- **Row selection UI**: out-of-the-box support for row selection with header and cell checkboxes
- **Column visibility toggles**: easy-to-use helper for showing/hiding columns
- **Global filter helpers**: ready-to-use global filter input and fuzzy filter function
- **CSV export utility**: one-liner export of table data to CSV
- **Tailwind CSS-friendly**: default classes and structure designed for Tailwind projects
- **TypeScript-first**: strong generics and prop types for safety and DX
- **Minimal boilerplate**: get advanced tables running with just a few lines of code

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
