import React from "react";
import { Table as TanStackTable } from "@tanstack/react-table";

// Helper for creating global filter input
export const GlobalFilterInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "px-4 py-2 border rounded",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

// Helper for creating column visibility toggles
export const ColumnVisibilityToggle = <TData extends object>({
  table,
  className = "p-2",
}: {
  table: TanStackTable<TData>;
  className?: string;
}) => {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {table.getAllLeafColumns().map((column) => {
          return (
            <div key={column.id} className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  className="mr-1"
                />
                {column.id}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
