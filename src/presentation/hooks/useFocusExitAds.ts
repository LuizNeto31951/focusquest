import { useState, useCallback } from 'react';
import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-4994961522725495/3427655440';

function showOneRewarded(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    let rewardEarned = false;

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      ad.show();
    });

    const unsubReward = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      rewardEarned = true;
    });

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      unsubLoaded();
      unsubReward();
      unsubClosed();
      unsubError();
      resolve(rewardEarned);
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubLoaded();
      unsubReward();
      unsubClosed();
      unsubError();
      reject(error);
    });

    ad.load();
  });
}

export function useFocusExitAds() {
  const [loadingAds, setLoadingAds] = useState(false);

  const showRewardedAd = useCallback(async (): Promise<boolean> => {
    setLoadingAds(true);
    try {
      return await showOneRewarded();
    } catch {
      return false;
    } finally {
      setLoadingAds(false);
    }
  }, []);

  return { showRewardedAd, loadingAds };
}
