import { AppBlocker as NativeAppBlocker, isAppBlockerAvailable } from 'app-blocker';
import type { AppBlocker, InstalledAppInfo } from '@/application/ports';

export class ExpoAppBlocker implements AppBlocker {
  readonly isSupported = isAppBlockerAvailable;

  async hasUsageAccessPermission(): Promise<boolean> {
    if (!this.isSupported) return false;
    return NativeAppBlocker.hasUsageAccessPermission();
  }

  async requestUsageAccessPermission(): Promise<void> {
    if (!this.isSupported) return;
    await NativeAppBlocker.requestUsageAccessPermission();
  }

  async hasOverlayPermission(): Promise<boolean> {
    if (!this.isSupported) return false;
    return NativeAppBlocker.hasOverlayPermission();
  }

  async requestOverlayPermission(): Promise<void> {
    if (!this.isSupported) return;
    await NativeAppBlocker.requestOverlayPermission();
  }

  async listInstalledApps(): Promise<InstalledAppInfo[]> {
    if (!this.isSupported) return [];
    const apps = await NativeAppBlocker.listInstalledApps();
    return apps.map((a) => ({
      packageName: a.packageName,
      label: a.label,
      isSystem: a.isSystem,
      iconBase64: a.iconBase64 ?? null,
    }));
  }

  async startBlocking(packageNames: readonly string[]): Promise<void> {
    if (!this.isSupported) return;
    await NativeAppBlocker.startBlocking([...packageNames]);
  }

  async stopBlocking(): Promise<void> {
    if (!this.isSupported) return;
    await NativeAppBlocker.stopBlocking();
  }

  async updateFocusNotification(title: string, text: string): Promise<void> {
    if (!this.isSupported) return;
    await NativeAppBlocker.updateFocusNotification(title, text);
  }
}
