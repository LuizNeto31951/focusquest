import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initializeDatabase } from '@/infrastructure';
import { buildAppDependencies, type AppDependencies } from '@/presentation/composition';
import { useUserStore } from '@/presentation/stores';
import { OnboardingScreen } from '@/presentation/screens/OnboardingScreen';
import { AppDependenciesProvider } from './AppDependenciesProvider';
import { useTheme } from './ThemeProvider';
import { ThemePersistenceGate } from './ThemePersistenceGate';

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
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const { client } = await initializeDatabase();
        const dependencies = buildAppDependencies(client);
        const user = await dependencies.ensureCurrentUser.execute({
          defaultName: defaultUserName,
        });
        if (cancelled) return;
        setUser(user);
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
  }, [defaultUserName, setUser]);

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
      <ThemePersistenceGate />
      <OnboardingGate>{children}</OnboardingGate>
    </AppDependenciesProvider>
  );
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const user = useUserStore((s) => s.user);
  if (!user) return null;
  if (!user.onboardingCompletedAt) {
    return <OnboardingScreen />;
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
