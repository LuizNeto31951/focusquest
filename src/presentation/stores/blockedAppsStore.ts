import { create } from 'zustand';

interface BlockedAppsState {
  selectedPackages: string[];
  setSelectedPackages: (packages: string[]) => void;
  togglePackage: (packageName: string) => void;
  clear: () => void;
}

export const useBlockedAppsStore = create<BlockedAppsState>((set, get) => ({
  selectedPackages: [],
  setSelectedPackages: (packages) => set({ selectedPackages: packages }),
  togglePackage: (packageName) => {
    const current = get().selectedPackages;
    set({
      selectedPackages: current.includes(packageName)
        ? current.filter((p) => p !== packageName)
        : [...current, packageName],
    });
  },
  clear: () => set({ selectedPackages: [] }),
}));
