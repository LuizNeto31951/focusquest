import React, { createContext, useContext } from 'react';
import type { AppDependencies } from '@/presentation/composition';

const AppDependenciesContext = createContext<AppDependencies | undefined>(undefined);

interface AppDependenciesProviderProps {
  dependencies: AppDependencies;
  children: React.ReactNode;
}

export function AppDependenciesProvider({
  dependencies,
  children,
}: AppDependenciesProviderProps) {
  return (
    <AppDependenciesContext.Provider value={dependencies}>
      {children}
    </AppDependenciesContext.Provider>
  );
}

export function useAppDependencies(): AppDependencies {
  const ctx = useContext(AppDependenciesContext);
  if (!ctx) {
    throw new Error(
      'useAppDependencies must be used inside an AppDependenciesProvider',
    );
  }
  return ctx;
}
