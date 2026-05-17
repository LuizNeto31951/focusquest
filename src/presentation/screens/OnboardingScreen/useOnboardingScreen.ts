import { useCallback, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useAppDependencies } from '@/presentation/providers';
import { useUserStore } from '@/presentation/stores';
import { useAppBlocker } from '@/presentation/hooks';

export function useOnboardingScreen(totalSteps: number) {
  const { completeOnboarding } = useAppDependencies();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [currentStep, setCurrentStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const blocker = useAppBlocker();

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const finish = useCallback(async () => {
    if (!user || finishing) return;
    setFinishing(true);
    try {
      const updated = await completeOnboarding.execute({ userId: user.id });
      setUser(updated);
    } finally {
      setFinishing(false);
    }
  }, [user, finishing, completeOnboarding, setUser]);

  const skip = useCallback(() => {
    void finish();
  }, [finish]);

  const requestUsageAccess = useCallback(async () => {
    await blocker.requestUsageAccess();
  }, [blocker]);

  const requestOverlay = useCallback(async () => {
    await blocker.requestOverlay();
  }, [blocker]);

  const openAndroidSettings = useCallback(() => {
    if (Platform.OS === 'android') {
      Linking.openSettings().catch(() => undefined);
    }
  }, []);

  return {
    currentStep,
    totalSteps,
    isLastStep: currentStep === totalSteps - 1,
    isFirstStep: currentStep === 0,
    finishing,
    goNext,
    goPrev,
    setCurrentStep,
    finish,
    skip,
    blockerSupported: blocker.supported,
    hasUsageAccess: blocker.hasUsageAccess,
    hasOverlay: blocker.hasOverlay,
    requestUsageAccess,
    requestOverlay,
    refreshPermissions: blocker.refreshPermissions,
    openAndroidSettings,
  };
}
