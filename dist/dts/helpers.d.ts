import { Table as TanStackTable } from "@tanstack/react-table";
export declare const GlobalFilterInput: ({ value, onChange, placeholder, className, }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ColumnVisibilityToggle: <TData extends object>({ table, className, }: {
    table: TanStackTable<TData>;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
