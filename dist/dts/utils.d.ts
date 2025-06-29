import { ColumnDef, FilterFn } from "@tanstack/react-table";
export declare const fuzzyFilter: FilterFn<any>;
export declare const exportToCSV: <TData extends object>(data: TData[], columns: ColumnDef<TData, any>[], filename?: string) => void;
export { fuzzyFilter as defaultFilterFn };
