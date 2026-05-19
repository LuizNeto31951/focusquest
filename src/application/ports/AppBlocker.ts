export interface InstalledAppInfo {
  readonly packageName: string;
  readonly label: string;
  readonly isSystem: boolean;
  readonly iconBase64?: string | null;
}

export interface AppBlocker {
  readonly isSupported: boolean;
  hasUsageAccessPermission(): Promise<boolean>;
  requestUsageAccessPermission(): Promise<void>;
  hasOverlayPermission(): Promise<boolean>;
  requestOverlayPermission(): Promise<void>;
  listInstalledApps(): Promise<InstalledAppInfo[]>;
  startBlocking(packageNames: readonly string[]): Promise<void>;
  stopBlocking(): Promise<void>;
  updateFocusNotification(title: string, text: string): Promise<void>;
}
