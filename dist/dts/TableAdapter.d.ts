import { RowData } from "@tanstack/react-table";
import { TableAdapterProps } from "./types";
declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}
export declare function TableAdapter<TData extends object>(props: TableAdapterProps<TData>): import("react/jsx-runtime").JSX.Element;
