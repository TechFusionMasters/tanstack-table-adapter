import { Table as TanStackTable } from "@tanstack/react-table";
export declare const EnhancedLoadingComponent: () => import("react/jsx-runtime").JSX.Element;
export declare const EnhancedPaginationLoadingComponent: () => import("react/jsx-runtime").JSX.Element;
export declare const DefaultLoadingComponent: () => import("react/jsx-runtime").JSX.Element;
export declare const DefaultPaginationLoadingComponent: () => import("react/jsx-runtime").JSX.Element;
export declare const DefaultNoResultsComponent: () => import("react/jsx-runtime").JSX.Element;
export declare const DefaultPaginationComponent: <TData extends object>({ table, totalRowCount, isLoading, pageSizeOptions, }: {
    table: TanStackTable<TData>;
    totalRowCount?: number;
    isLoading?: boolean;
    pageSizeOptions?: number[];
}) => import("react/jsx-runtime").JSX.Element;
