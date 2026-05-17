import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppBlocker } from '@/presentation/hooks';
import { useBlockedAppsStore } from '@/presentation/stores';

export function useBlockedAppsScreen() {
  const blocker = useAppBlocker();
  const selectedPackages = useBlockedAppsStore((s) => s.selectedPackages);
  const togglePackage = useBlockedAppsStore((s) => s.togglePackage);
  const clear = useBlockedAppsStore((s) => s.clear);
  const [search, setSearch] = useState('');
  const [showSystem, setShowSystem] = useState(true);

  useEffect(() => {
    if (blocker.supported && blocker.hasUsageAccess) {
      blocker.loadInstalledApps();
    }
  }, [blocker.supported, blocker.hasUsageAccess, blocker.loadInstalledApps]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return blocker.installedApps.filter((app) => {
      if (!showSystem && app.isSystem) return false;
      if (!term) return true;
      return (
        app.label.toLowerCase().includes(term) ||
        app.packageName.toLowerCase().includes(term)
      );
    });
  }, [blocker.installedApps, search, showSystem]);

  const selectedSet = useMemo(
    () => new Set(selectedPackages),
    [selectedPackages],
  );

  const onRequestUsageAccess = useCallback(async () => {
    await blocker.requestUsageAccess();
  }, [blocker]);

  const onRequestOverlay = useCallback(async () => {
    await blocker.requestOverlay();
  }, [blocker]);

  return {
    supported: blocker.supported,
    hasUsageAccess: blocker.hasUsageAccess,
    hasOverlay: blocker.hasOverlay,
    apps: filtered,
    loading: blocker.loading,
    error: blocker.error,
    search,
    setSearch,
    showSystem,
    setShowSystem,
    selectedSet,
    selectedCount: selectedPackages.length,
    togglePackage,
    clear,
    onRequestUsageAccess,
    onRequestOverlay,
    refreshPermissions: blocker.refreshPermissions,
  };
}
