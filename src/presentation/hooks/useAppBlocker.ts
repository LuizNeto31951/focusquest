import { useCallback, useEffect, useState } from 'react';
import type { InstalledAppInfo } from '@/application/ports';
import { useAppDependencies } from '@/presentation/providers';

export function useAppBlocker() {
  const { appBlocker } = useAppDependencies();
  const [hasUsage, setHasUsage] = useState(false);
  const [hasOverlay, setHasOverlay] = useState(false);
  const [installedApps, setInstalledApps] = useState<InstalledAppInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshPermissions = useCallback(async () => {
    if (!appBlocker.isSupported) return;
    const [u, o] = await Promise.all([
      appBlocker.hasUsageAccessPermission(),
      appBlocker.hasOverlayPermission(),
    ]);
    setHasUsage(u);
    setHasOverlay(o);
  }, [appBlocker]);

  const loadInstalledApps = useCallback(async () => {
    if (!appBlocker.isSupported) return;
    setLoading(true);
    setError(null);
    try {
      const apps = await appBlocker.listInstalledApps();
      setInstalledApps(apps);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [appBlocker]);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  return {
    supported: appBlocker.isSupported,
    isSupported: appBlocker.isSupported,
    hasUsageAccess: hasUsage,
    hasOverlay,
    installedApps,
    loading,
    error,
    refreshPermissions,
    loadInstalledApps,
    requestUsageAccess: appBlocker.requestUsageAccessPermission.bind(appBlocker),
    requestOverlay: appBlocker.requestOverlayPermission.bind(appBlocker),
    updateFocusNotification: appBlocker.updateFocusNotification.bind(appBlocker),
  };
}
