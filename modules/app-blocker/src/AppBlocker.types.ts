export interface InstalledApp {
  packageName: string;
  label: string;
  isSystem: boolean;
  iconBase64?: string | null;
}

export interface AppBlockerNativeModule {
  hasUsageAccessPermission(): Promise<boolean>;
  requestUsageAccessPermission(): Promise<void>;
  hasOverlayPermission(): Promise<boolean>;
  requestOverlayPermission(): Promise<void>;
  listInstalledApps(): Promise<InstalledApp[]>;
  startBlocking(packageNames: string[]): Promise<void>;
  stopBlocking(): Promise<void>;
}
