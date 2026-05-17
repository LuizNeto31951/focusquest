import { Platform, requireOptionalNativeModule } from 'expo-modules-core';
import type {
  AppBlockerNativeModule,
  InstalledApp,
} from './src/AppBlocker.types';

const native = requireOptionalNativeModule<AppBlockerNativeModule>('AppBlocker');

const noop = async () => {
  throw new Error(
    'AppBlocker só é suportado em Android com módulo nativo. Faça um build de dev/EAS.',
  );
};

export const AppBlocker: AppBlockerNativeModule = native ?? {
  hasUsageAccessPermission: async () => false,
  requestUsageAccessPermission: noop,
  hasOverlayPermission: async () => false,
  requestOverlayPermission: noop,
  listInstalledApps: async () => [],
  startBlocking: noop as unknown as (pkgs: string[]) => Promise<void>,
  stopBlocking: async () => undefined,
};

export const isAppBlockerAvailable: boolean =
  Platform.OS === 'android' && native !== null;

export type { InstalledApp, AppBlockerNativeModule };
