import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initializeDatabase } from '@/infrastructure';
import { buildAppDependencies, type AppDependencies } from '@/presentation/composition';
import { AppDependenciesProvider } from './AppDependenciesProvider';
import { useTheme } from './ThemeProvider';

interface AppBootstrapProps {
  defaultUserName: string;
  children: React.ReactNode;
}

type BootState =
  | { status: 'loading' }
  | { status: 'ready'; dependencies: AppDependencies }
  | { status: 'error'; error: Error };

export function AppBootstrap({ defaultUserName, children }: AppBootstrapProps) {
  const [state, setState] = useState<BootState>({ status: 'loading' });
  const theme = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const { client } = await initializeDatabase();
        const dependencies = buildAppDependencies(client);
        await dependencies.ensureCurrentUser.execute({ defaultName: defaultUserName });
        await dependencies.notificationScheduler.requestPermissions().catch(() => false);
        if (!cancelled) setState({ status: 'ready', dependencies });
      } catch (err) {
        if (!cancelled) {
          setState({ status: 'error', error: err as Error });
        }
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [defaultUserName]);

  if (state.status === 'loading') {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.danger} />
      </View>
    );
  }

  return (
    <AppDependenciesProvider dependencies={state.dependencies}>
      {children}
    </AppDependenciesProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
