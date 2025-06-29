import React from "react";
/**
 * TableWithLoadingStates - A wrapper component that manages loading states for TableAdapter
 * This separates loading UI concerns from the table component itself
 */
export declare function TableWithLoadingStates({ isInitialLoading, isPaginationLoading, loadingComponent, paginationLoadingComponent, children, }: {
    isInitialLoading?: boolean;
    isPaginationLoading?: boolean;
    loadingComponent?: React.ReactNode;
    paginationLoadingComponent?: React.ReactNode;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
