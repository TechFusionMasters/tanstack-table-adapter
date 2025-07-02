import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { DefaultTableClassNames, TableConfig } from "./types";
import { DEFAULT_TABLE_CLASSNAMES, mergeClassNames } from "./utils";

// Create the context with undefined default value
const TableConfigContext = createContext<TableConfig | undefined>(undefined);

/**
 * Provider component for table configuration
 * Manages global styling defaults for all TableAdapter instances
 */
export function TableConfigProvider({
  children,
  initialClassNames,
}: {
  children: ReactNode;
  initialClassNames?: Partial<DefaultTableClassNames>;
}) {
  // Memoize the initial merged classNames to avoid unnecessary calculations
  const initialMergedClassNames = useMemo(
    () => ({
      ...DEFAULT_TABLE_CLASSNAMES,
      ...initialClassNames,
    }),
    []
  );

  // Store class names in state with memoized initial value
  const [defaultClassNames, setDefaultClassNamesState] =
    useState<DefaultTableClassNames>(initialMergedClassNames);

  // Memoize the setDefaultClassNames function to prevent unnecessary rerenders
  const setDefaultClassNames = useCallback(
    (classNames: Partial<DefaultTableClassNames>) => {
      setDefaultClassNamesState((prev) => ({
        ...prev,
        ...classNames,
      }));
    },
    []
  );

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = useMemo<TableConfig>(
    () => ({
      defaultClassNames,
      setDefaultClassNames,
    }),
    [defaultClassNames, setDefaultClassNames]
  );

  return (
    <TableConfigContext.Provider value={contextValue}>
      {children}
    </TableConfigContext.Provider>
  );
}

/**
 * Hook to use the table configuration
 * @returns The table configuration from context
 * @throws Error if used outside of a TableConfigProvider
 */
export function useTableConfig(): TableConfig {
  const context = useContext(TableConfigContext);
  if (context === undefined) {
    throw new Error("useTableConfig must be used within a TableConfigProvider");
  }
  return context;
}

/**
 * Hook to get default classNames with fallback
 * @returns Default class names from context or fallback defaults
 */
export function useDefaultTableClassNames(): DefaultTableClassNames {
  try {
    const { defaultClassNames } = useTableConfig();
    return defaultClassNames;
  } catch {
    // Fallback to defaults if no provider is available
    return DEFAULT_TABLE_CLASSNAMES;
  }
}

/**
 * Hook to apply component-specific class names on top of defaults
 * @param componentClassNames Component-specific class names
 * @returns Merged class names with proper precedence
 */
export function useTableClassNames(
  componentClassNames?: Partial<DefaultTableClassNames>
): DefaultTableClassNames {
  const defaultClassNames = useDefaultTableClassNames();

  // Memoize the merged class names to prevent unnecessary calculations
  return useMemo(
    () => mergeClassNames(defaultClassNames, componentClassNames),
    [defaultClassNames, componentClassNames]
  );
}

/**
 * HOC to wrap a component with TableConfigProvider
 * @param Component Component to wrap
 * @param initialClassNames Initial class names for the provider
 * @returns Wrapped component with table configuration
 */
export function withTableConfig<P extends object>(
  Component: React.ComponentType<P>,
  initialClassNames?: Partial<DefaultTableClassNames>
): React.FC<P> {
  const WithTableConfig: React.FC<P> = (props) => (
    <TableConfigProvider initialClassNames={initialClassNames}>
      <Component {...props} />
    </TableConfigProvider>
  );

  WithTableConfig.displayName = `WithTableConfig(${
    Component.displayName || Component.name || "Component"
  })`;

  return WithTableConfig;
}
